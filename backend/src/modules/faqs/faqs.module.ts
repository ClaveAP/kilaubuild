import { Module } from '@nestjs/common';
import { FaqsService } from './faqs.service.js';
import { FaqsController } from './faqs.controller.js';

@Module({
  controllers: [FaqsController],
  providers: [FaqsService],
  exports: [FaqsService],
})
export class FaqsModule {}
