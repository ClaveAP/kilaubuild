import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Terhubung ke database PostgreSQL (Neon/Local) via Prisma ORM.');
    } catch (error) {
      this.logger.error('Gagal terhubung ke database:', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Koneksi database berhasil ditutup.');
  }
}
