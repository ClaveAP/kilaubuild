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
import { StatisticsService } from './statistics.service.js';
import { CreateStatisticDto } from './dto/create-statistic.dto.js';
import { UpdateStatisticDto } from './dto/update-statistic.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Dapatkan seluruh data counter statistik (Publik)' })
  @ApiResponse({ status: 200, description: 'Daftar statistik berhasil diambil' })
  findAll() {
    return this.statisticsService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Dapatkan detail satu data statistik (Publik)' })
  findOne(@Param('id') id: string) {
    return this.statisticsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Tambah data statistik baru (Admin)' })
  create(@Body() dto: CreateStatisticDto) {
    return this.statisticsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: 'Update data statistik (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateStatisticDto) {
    return this.statisticsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Hapus data statistik (Admin)' })
  remove(@Param('id') id: string) {
    return this.statisticsService.remove(id);
  }
}
