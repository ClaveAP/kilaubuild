import { Module } from '@nestjs/common';
import { InstagramPostsService } from './instagram-posts.service.js';
import { InstagramPostsController } from './instagram-posts.controller.js';

@Module({
  controllers: [InstagramPostsController],
  providers: [InstagramPostsService],
  exports: [InstagramPostsService],
})
export class InstagramPostsModule {}
