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
import { FaqsService } from './faqs.service.js';
import { CreateFaqDto } from './dto/create-faq.dto.js';
import { UpdateFaqDto } from './dto/update-faq.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@ApiTags('FAQs')
@Controller('faqs')
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Dapatkan daftar FAQ yang aktif (Publik)' })
  @ApiResponse({ status: 200, description: 'Daftar FAQ berhasil diambil' })
  findAllPublic() {
    return this.faqsService.findAll(true);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('admin/all')
  @ApiOperation({ summary: 'Dapatkan seluruh FAQ termasuk yang non-aktif (Admin)' })
  findAllAdmin() {
    return this.faqsService.findAll(false);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Dapatkan detail satu FAQ' })
  findOne(@Param('id') id: string) {
    return this.faqsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Tambah FAQ baru (Admin)' })
  create(@Body() dto: CreateFaqDto) {
    return this.faqsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: 'Update FAQ (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateFaqDto) {
    return this.faqsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Hapus FAQ (Admin)' })
  remove(@Param('id') id: string) {
    return this.faqsService.remove(id);
  }
}
