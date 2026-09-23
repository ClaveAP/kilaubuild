import { PartialType } from '@nestjs/swagger';
import { CreateTestimonyDto } from './create-testimony.dto.js';

export class UpdateTestimonyDto extends PartialType(CreateTestimonyDto) {}
