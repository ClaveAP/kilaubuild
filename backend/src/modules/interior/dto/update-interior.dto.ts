import { PartialType } from '@nestjs/swagger';
import { CreateInteriorDto } from './create-interior.dto.js';

export class UpdateInteriorDto extends PartialType(CreateInteriorDto) {}
