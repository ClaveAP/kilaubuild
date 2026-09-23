import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';

import { PrismaModule } from './database/prisma.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { StatisticsModule } from './modules/statistics/statistics.module.js';
import { InstagramPostsModule } from './modules/instagram-posts/instagram-posts.module.js';
import { FaqsModule } from './modules/faqs/faqs.module.js';
import { TestimoniesModule } from './modules/testimonies/testimonies.module.js';
import { ProjectsModule } from './modules/projects/projects.module.js';
import { InteriorModule } from './modules/interior/interior.module.js';
import { ContactsModule } from './modules/contacts/contacts.module.js';
import { BookingsModule } from './modules/bookings/bookings.module.js';
import { MediaModule } from './modules/media/media.module.js';
import { DashboardModule } from './modules/dashboard/dashboard.module.js';

import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';
import { AllExceptionsFilter } from './common/filters/http-exception.filter.js';

@Module({
  imports: [
    // 1. Environment Config Terpusat
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. Anti Brute-Force & Rate Limiting Global
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('THROTTLE_TTL', 60000),
          limit: configService.get<number>('THROTTLE_LIMIT', 20),
        },
      ],
      inject: [ConfigService],
    }),

    // 3. Database Layer
    PrismaModule,

    // 4. Feature Modules
    AuthModule,
    StatisticsModule,
    InstagramPostsModule,
    FaqsModule,
    TestimoniesModule,
    ProjectsModule,
    InteriorModule,
    ContactsModule,
    BookingsModule,
    MediaModule,
    DashboardModule,
  ],
  providers: [
    // Global Rate Limiting Guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Global Standard Response Transformer
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    // Global Exception Filter
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
