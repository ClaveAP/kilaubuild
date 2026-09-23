import { PartialType } from '@nestjs/swagger';
import { CreateOngoingProjectDto } from './create-ongoing-project.dto.js';

export class UpdateOngoingProjectDto extends PartialType(CreateOngoingProjectDto) {}
