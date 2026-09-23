import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ContactsService } from './contacts.service.js';
import { CreateContactDto } from './dto/create-contact.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@ApiTags('Contacts & Feedback')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Public()
  @Throttle({ default: { limit: 10, ttl: 900000 } }) // Anti spam: max 10 submit per 15 menit
  @Post()
  @ApiOperation({ summary: 'Kirim formulir pesan kontak/feedback (Publik)' })
  @ApiResponse({ status: 201, description: 'Pesan berhasil terkirim' })
  @ApiResponse({ status: 429, description: 'Terlalu banyak permintaan, coba lagi nanti' })
  create(@Body() dto: CreateContactDto) {
    return this.contactsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Dapatkan seluruh pesan masuk inbox (Admin)' })
  @ApiQuery({ name: 'isRead', required: false, type: Boolean, description: 'Filter status sudah dibaca atau belum' })
  findAll(@Query('isRead') isRead?: string) {
    const isReadBool = isRead !== undefined ? isRead === 'true' : undefined;
    return this.contactsService.findAll(isReadBool);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Dapatkan detail satu pesan (Admin)' })
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id/read')
  @ApiOperation({ summary: 'Tandai pesan sudah dibaca (Admin)' })
  markAsRead(@Param('id') id: string) {
    return this.contactsService.markAsRead(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Hapus pesan dari inbox (Admin)' })
  remove(@Param('id') id: string) {
    return this.contactsService.remove(id);
  }
}
