import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TestimoniesService } from './testimonies.service.js';
import { CreateTestimonyDto } from './dto/create-testimony.dto.js';
import { UpdateTestimonyDto } from './dto/update-testimony.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@ApiTags('Testimonials')
@Controller('testimonies')
export class TestimoniesController {
  constructor(private readonly testimoniesService: TestimoniesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Dapatkan seluruh ulasan testimoni klien (Publik)' })
  @ApiResponse({ status: 200, description: 'Daftar testimoni berhasil diambil' })
  findAll() {
    return this.testimoniesService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Dapatkan detail satu ulasan testimoni' })
  findOne(@Param('id') id: string) {
    return this.testimoniesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Tambah testimoni baru (Admin)' })
  create(@Body() dto: CreateTestimonyDto) {
    return this.testimoniesService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: 'Update testimoni (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateTestimonyDto) {
    return this.testimoniesService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Hapus testimoni (Admin)' })
  remove(@Param('id') id: string) {
    return this.testimoniesService.remove(id);
  }
}
