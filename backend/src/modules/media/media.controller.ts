import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

const UPLOAD_DIR = './public/uploads';

// Pastikan folder uploads tersedia
if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

@ApiTags('Media & Uploads')
@Controller('media')
export class MediaController {
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('upload')
  @ApiOperation({ summary: 'Unggah file gambar (Admin: JPG, PNG, WEBP, maks 5MB)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File gambar portofolio atau media',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File berhasil diunggah' })
  @ApiResponse({ status: 400, description: 'Format file tidak diizinkan atau ukuran melebihi batas' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOAD_DIR,
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname).toLowerCase();
          callback(null, `kilau-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
      fileFilter: (req, file, callback) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        if (!allowedMimes.includes(file.mimetype)) {
          return callback(
            new BadRequestException('Format file tidak didukung. Harap gunakan JPG, PNG, atau WEBP.'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File tidak ditemukan dalam request');
    }

    const publicUrl = `/uploads/${file.filename}`;

    return {
      message: 'File berhasil diunggah',
      data: {
        url: publicUrl,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
      },
    };
  }
}
