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
import { InstagramPostsService } from './instagram-posts.service.js';
import { CreateInstagramPostDto } from './dto/create-post.dto.js';
import { UpdateInstagramPostDto } from './dto/update-post.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@ApiTags('Instagram Posts')
@Controller('instagram-posts')
export class InstagramPostsController {
  constructor(private readonly instagramPostsService: InstagramPostsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Dapatkan feed postingan Instagram (Publik)' })
  @ApiResponse({ status: 200, description: 'Daftar postingan Instagram berhasil diambil' })
  findAll() {
    return this.instagramPostsService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Dapatkan detail satu post Instagram (Publik)' })
  findOne(@Param('id') id: string) {
    return this.instagramPostsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Tambah postingan Instagram baru (Admin)' })
  create(@Body() dto: CreateInstagramPostDto) {
    return this.instagramPostsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: 'Update postingan Instagram (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateInstagramPostDto) {
    return this.instagramPostsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Hapus postingan Instagram (Admin)' })
  remove(@Param('id') id: string) {
    return this.instagramPostsService.remove(id);
  }
}
