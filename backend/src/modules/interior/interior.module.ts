import { Module } from '@nestjs/common';
import { InteriorService } from './interior.service.js';
import { InteriorController } from './interior.controller.js';

@Module({
  controllers: [InteriorController],
  providers: [InteriorService],
  exports: [InteriorService],
})
export class InteriorModule {}
