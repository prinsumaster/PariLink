import { NestFactory } from '@nestjs/core';
import { AppModule } from './apps/api/src/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  await app.init();

  const server = app.getHttpServer();
  const router = server._events.request._router;

  console.log("=== RUNTIME ROUTES ===");
  const availableRoutes: [] = router.stack
    .map((layer: any) => {
      if (layer.route) {
        return {
          route: {
            path: layer.route?.path,
            method: Object.keys(layer.route.methods)[0].toUpperCase(),
          },
        };
      }
    })
    .filter((item: any) => item !== undefined);
    
  for (const route of availableRoutes) {
      console.log(`[${(route as any).route.method}] ${(route as any).route.path}`);
  }
  
  process.exit(0);
}
bootstrap();
