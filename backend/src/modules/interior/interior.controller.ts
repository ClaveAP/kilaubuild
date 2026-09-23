import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InteriorService } from './interior.service.js';
import { CreateInteriorDto } from './dto/create-interior.dto.js';
import { UpdateInteriorDto } from './dto/update-interior.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@ApiTags('Desain Interior')
@Controller('desain-interiors')
export class InteriorController {
  constructor(private readonly interiorService: InteriorService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Dapatkan galeri desain interior (Publik)' })
  @ApiQuery({ name: 'roomType', required: false, description: 'Filter berdasarkan tipe ruangan (e.g. Living Room)' })
  @ApiResponse({ status: 200, description: 'Galeri interior berhasil diambil' })
  findAll(@Query('roomType') roomType?: string) {
    return this.interiorService.findAll(roomType);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Dapatkan detail satu inspirasi desain interior' })
  findOne(@Param('id') id: string) {
    return this.interiorService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Tambah desain interior baru (Admin)' })
  create(@Body() dto: CreateInteriorDto) {
    return this.interiorService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: 'Update desain interior (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateInteriorDto) {
    return this.interiorService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Hapus desain interior (Admin)' })
  remove(@Param('id') id: string) {
    return this.interiorService.remove(id);
  }
}
