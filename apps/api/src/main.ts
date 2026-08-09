// import './tracer';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { CircuitBreakerInterceptor } from './common/interceptors/circuit-breaker.interceptor';
import { RedisIoAdapter } from './platform/websockets/redis-io.adapter';
import { csrfMiddleware } from './common/middlewares/csrf.middleware';

// ---------------------------------------------------------------------------
// Bootstrap — Enterprise Security Hardening
//
// Security controls applied at the HTTP layer:
//   1. Helmet — Sets 15+ security headers (CSP, HSTS, X-Frame-Options, etc.)
//   2. Compression — Gzip/Brotli (performance + cost reduction)
//   3. CORS — Strict allowlist-only; no wildcard in production
//   4. CookieParser — Enables signed-cookie parsing for HttpOnly refresh tokens
//   5. ValidationPipe — Whitelist + transform prevents mass-assignment attacks
//   6. Request ID injection — Every request gets a correlation ID
//   7. Global exception filter — Sanitized error responses (no stack traces in prod)
//   8. API Prefix — '/api' prefix with native URI versioning (v1 default)
// ---------------------------------------------------------------------------

async function bootstrap() {
  // ── Pre-boot security configuration verification (Fail-Fast)
  const requiredEnvVars = [
    'DATABASE_URL',
    'REDIS_URL',
    'JWT_SECRET',
    'COOKIE_SECRET',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'RESEND_API_KEY',
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_PHONE_NUMBER',
    'MAPBOX_TOKEN',
    'MINIO_ENDPOINT',
    'MINIO_ACCESS_KEY',
    'MINIO_SECRET_KEY',
    'SMTP_FROM_EMAIL',
  ];

  const missingVars = requiredEnvVars.filter((v) => !process.env[v]);

  if (missingVars.length > 0) {
    console.error(
      `CRITICAL: Missing required environment variables: ${missingVars.join(', ')}`,
    );
    if (process.env.NODE_ENV === 'production') {
      console.error(
        'Startup aborted due to missing configuration in production.',
      );
      process.exit(1);
    }
  }

  if (
    !process.env.JWT_SECRET ||
    process.env.JWT_SECRET === 'super-secret-fallback' ||
    process.env.JWT_SECRET === 'parilink-secure-jwt-secret-in-prod'
  ) {
    console.error(
      '⚠️  CRITICAL: JWT_SECRET is not set or uses an insecure/default value. ' +
        "Generate a 64-byte hex secret: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\"",
    );
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }

  if (!process.env.MASTER_ENCRYPTION_KEY_V1) {
    console.warn(
      '⚠️  WARNING: MASTER_ENCRYPTION_KEY_V1 is not set. ' +
        'Envelope encryption is using an ephemeral key — data encrypted this session cannot be decrypted after restart.',
    );
    if (process.env.NODE_ENV === 'production') {
      console.error(
        'Startup aborted. MASTER_ENCRYPTION_KEY_V1 is mandatory in production.',
      );
      process.exit(1);
    }
  }

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    rawBody: true,
  });

  const appLogger = app.get(Logger);
  app.useLogger(appLogger);
  app.useGlobalInterceptors(
    new LoggerErrorInterceptor(),
    new CircuitBreakerInterceptor(),
  );
  app.enableShutdownHooks();

  // ── WebSocket Redis Adapter
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  // ── Payload Limits (Enterprise Bulk Operations)
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  // ── Cookie parsing (HttpOnly refresh token support)
  app.use(cookieParser(process.env.COOKIE_SECRET));

  // ── CSRF Protection (Double Submit Cookie for Browser Sessions)
  app.use(csrfMiddleware);

  // ── Helmet: HTTP security headers
  // https://helmetjs.github.io/
  const helmet = require('helmet');
  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production'
          ? {
              directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'strict-dynamic'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", 'data:', 'https:'],
                connectSrc: ["'self'"],
                fontSrc: ["'self'"],
                objectSrc: ["'none'"],
                frameSrc: ["'none'"],
                upgradeInsecureRequests: [],
              },
            }
          : false, // Disable CSP in dev so Swagger UI works
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      crossOriginEmbedderPolicy: false, // Allow Swagger UI
      crossOriginResourcePolicy: false, // Allow cross-origin frontend fetch
      permittedCrossDomainPolicies: { permittedPolicies: 'none' },
    }),
  );

  // Permissions-Policy header (not covered by helmet)
  app.use((_req: any, res: any, nextFn: any) => {
    res.setHeader(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(self), payment=(), usb=()',
    );
    nextFn();
  });

  // ── Compression
  const compression = require('compression');
  app.use(compression());

  // ── CORS — strict allowlist
  const allowedOrigins: string[] = (
    process.env.CORS_ALLOWED_ORIGINS ||
    'http://localhost:5173,http://localhost:3000,http://localhost:3001'
  )
    .split(',')
    .map((o) => o.trim());

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow same-origin (no origin header) and listed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        appLogger.warn(
          `[CORS] Rejected request from unauthorized origin: ${origin}`,
        );
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Request-Id',
      'X-Tenant-Id',
      'X-Idempotency-Key',
      'X-Signature',
      'X-Timestamp',
      'X-Nonce',
      'Cache-Control',
      'Pragma',
    ],
    exposedHeaders: ['X-Request-Id', 'X-RateLimit-Remaining'],
    credentials: true,
    maxAge: 86400, // Preflight cache: 24h
  });

  // ── Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip undeclared properties (prevent mass-assignment)
      transform: true, // Auto-transform to DTO types
      forbidNonWhitelisted: true, // Reject requests with extra properties
      forbidUnknownValues: true, // Fail on unknown class-validator values
      stopAtFirstError: false, // Return all validation errors at once
    }),
  );

  // ── Global Exception Filter (sanitized responses — no internal stack traces)
  app.useGlobalFilters(new GlobalExceptionFilter());

  // ── API Versioning
  app.setGlobalPrefix('api', { exclude: ['health', 'api/docs'] });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // ── Swagger (disabled in production)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('PariLink Logistics OS API')
      .setDescription(
        'Enterprise Logistics Operating System — Internal Engineering Reference.\n\n' +
          '⚠️ This documentation is disabled in production environments.\n\n' +
          'For Public API V2 Integration, refer to /api/v2 endpoints.',
      )
      .setVersion('2.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'JWT-auth',
      )
      .addApiKey(
        {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: 'API Key or PAT starting with Bearer pk_ or Bearer pat_',
        },
        'API-Key',
      )
      .addOAuth2(
        {
          type: 'oauth2',
          flows: {
            clientCredentials: {
              tokenUrl: '/api/v2/oauth/token',
              scopes: {},
            },
          },
        },
        'OAuth2',
      )
      .addTag('Auth', 'Authentication & Session Management')
      .addTag('Developer Portal', 'Manage Developer Applications & Secrets')
      .addTag('API Lifecycle', 'API Versioning & Deprecation')
      .addTag('SDK Automation', 'Client SDK Generation')
      .addTag('Marketplace', 'Integration Marketplace & Webhooks')
      .addTag('Webhooks', 'Enterprise Webhook Delivery Platform')
      .addTag('Fleet', 'Vehicle & Driver Intelligence')
      .addTag('Trips', 'Trip & Load Management')
      .addTag('Finance', 'Invoicing, Billing & Payments')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    // Export Swagger JSON for Docusaurus Knowledge Hub
    const docsStaticPath = path.join(__dirname, '../../../../apps/docs/static');
    if (!fs.existsSync(docsStaticPath)) {
      fs.mkdirSync(docsStaticPath, { recursive: true });
    }
    fs.writeFileSync(
      path.join(docsStaticPath, 'openapi.json'),
      JSON.stringify(document, null, 2),
    );

    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
      },
    });
    appLogger.log('Swagger UI available at /api/docs (DEV only)');
  }

  app.enableShutdownHooks(); // P1: Required for graceful BullMQ & Prisma termination

  const port = process.env.PORT ?? 8080;
  await app.listen(port);

  appLogger.log(
    `PariLink API running on port ${port} [${process.env.NODE_ENV ?? 'development'}]`,
  );
}

bootstrap();
