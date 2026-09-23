import { PartialType } from '@nestjs/swagger';
import { CreateInstagramPostDto } from './create-post.dto.js';

export class UpdateInstagramPostDto extends PartialType(CreateInstagramPostDto) {}
