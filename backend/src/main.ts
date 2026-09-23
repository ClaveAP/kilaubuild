import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const logger = new Logger('KilauBuildBootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 1. Security Headers (Helmet)
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' }, // Izinkan akses gambar statis dari frontend
    }),
  );

  // 2. CORS (Cross-Origin Resource Sharing)
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
    : ['http://localhost:3000', 'http://localhost:3001'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // 3. Global Prefix & Validation Pipe
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Hapus otomatis field yang tidak didefinisikan di DTO
      forbidNonWhitelisted: true, // Error jika ada payload liar
      transform: true, // Otomatis transform tipe data (string ke number, dll.)
    }),
  );

  // 4. Static Assets Hosting (Foto Portofolio / Uploads)
  app.useStaticAssets(join(process.cwd(), 'public'));

  // 5. Swagger OpenAPI Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('KilauBuild REST API')
    .setDescription(
      'Dokumentasi resmi REST API untuk Company Profile dan CMS KilauBuild (Kontraktor & Desain Interior)',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Masukkan JWT Token admin di sini',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'KilauBuild API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`🚀 Backend KilauBuild siap berjalan di: http://localhost:${port}/api/v1`);
  logger.log(`📖 Dokumentasi Swagger UI interaktif: http://localhost:${port}/api/docs`);
}

await bootstrap();
