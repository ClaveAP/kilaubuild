import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service.js';
import { ProjectsController } from './projects.controller.js';
import {
  OngoingProjectsController,
  ProjectDonesController,
} from './project-aliases.controller.js';

@Module({
  controllers: [ProjectsController, ProjectDonesController, OngoingProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
