import { PartialType } from '@nestjs/swagger';
import { CreateProjectDoneDto } from './create-project-done.dto.js';

export class UpdateProjectDoneDto extends PartialType(CreateProjectDoneDto) {}
