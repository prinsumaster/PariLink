import './tracer';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('WorkerBootstrap');
  
  // Force RUN_WORKERS to true for the worker process
  process.env.RUN_WORKERS = 'true';

  // Create a headless NestJS application context (no HTTP server)
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  app.enableShutdownHooks();

  await app.init();
  logger.log('🚀 PariLink Background Worker Process Started Successfully');
}

bootstrap().catch((err) => {
  console.error('Worker failed to start', err);
  process.exit(1);
});
