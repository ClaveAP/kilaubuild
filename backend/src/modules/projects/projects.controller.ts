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
import { ProjectsService } from './projects.service.js';
import { CreateProjectDoneDto } from './dto/create-project-done.dto.js';
import { UpdateProjectDoneDto } from './dto/update-project-done.dto.js';
import { CreateOngoingProjectDto } from './dto/create-ongoing-project.dto.js';
import { UpdateOngoingProjectDto } from './dto/update-ongoing-project.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // ==========================================
  // 1. PROJECT DONE ENDPOINTS
  // ==========================================
  @Public()
  @Get('done')
  @ApiOperation({ summary: 'Dapatkan daftar seluruh portofolio proyek selesai (Publik)' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter berdasarkan kategori (e.g. Residensial)' })
  @ApiResponse({ status: 200, description: 'Daftar proyek selesai berhasil diambil' })
  findAllDone(@Query('category') category?: string) {
    return this.projectsService.findAllDone(category);
  }

  @Public()
  @Get('done/:id')
  @ApiOperation({ summary: 'Dapatkan detail satu proyek selesai dan galeri fotonya (Publik)' })
  findOneDone(@Param('id') id: string) {
    return this.projectsService.findOneDone(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('done')
  @ApiOperation({ summary: 'Tambah portofolio proyek selesai baru (Admin)' })
  createDone(@Body() dto: CreateProjectDoneDto) {
    return this.projectsService.createDone(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('done/:id')
  @ApiOperation({ summary: 'Update data proyek selesai (Admin)' })
  updateDone(@Param('id') id: string, @Body() dto: UpdateProjectDoneDto) {
    return this.projectsService.updateDone(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('done/:id')
  @ApiOperation({ summary: 'Hapus proyek selesai (Admin)' })
  removeDone(@Param('id') id: string) {
    return this.projectsService.removeDone(id);
  }

  // ==========================================
  // 2. ONGOING PROJECT ENDPOINTS
  // ==========================================
  @Public()
  @Get('ongoing')
  @ApiOperation({ summary: 'Dapatkan daftar proyek yang sedang berjalan (Publik)' })
  @ApiResponse({ status: 200, description: 'Daftar ongoing projects berhasil diambil' })
  findAllOngoing() {
    return this.projectsService.findAllOngoing();
  }

  @Public()
  @Get('ongoing/:id')
  @ApiOperation({ summary: 'Dapatkan detail satu proyek berjalan (Publik)' })
  findOneOngoing(@Param('id') id: string) {
    return this.projectsService.findOneOngoing(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('ongoing')
  @ApiOperation({ summary: 'Tambah proyek berjalan baru (Admin)' })
  createOngoing(@Body() dto: CreateOngoingProjectDto) {
    return this.projectsService.createOngoing(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('ongoing/:id')
  @ApiOperation({ summary: 'Update progres proyek berjalan (Admin)' })
  updateOngoing(@Param('id') id: string, @Body() dto: UpdateOngoingProjectDto) {
    return this.projectsService.updateOngoing(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('ongoing/:id')
  @ApiOperation({ summary: 'Hapus proyek berjalan (Admin)' })
  removeOngoing(@Param('id') id: string) {
    return this.projectsService.removeOngoing(id);
  }
}
