import { Module } from '@nestjs/common';
import { TestimoniesService } from './testimonies.service.js';
import { TestimoniesController } from './testimonies.controller.js';

@Module({
  controllers: [TestimoniesController],
  providers: [TestimoniesService],
  exports: [TestimoniesService],
})
export class TestimoniesModule {}
