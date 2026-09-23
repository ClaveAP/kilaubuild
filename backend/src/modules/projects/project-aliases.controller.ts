import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { CreateOngoingProjectDto } from './dto/create-ongoing-project.dto.js';
import { CreateProjectDoneDto } from './dto/create-project-done.dto.js';
import { UpdateOngoingProjectDto } from './dto/update-ongoing-project.dto.js';
import { UpdateProjectDoneDto } from './dto/update-project-done.dto.js';
import { ProjectsService } from './projects.service.js';

@ApiTags('Project Dones')
@Controller('project-dones')
export class ProjectDonesController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Dapatkan daftar seluruh portofolio proyek selesai (Publik)' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter berdasarkan kategori' })
  @ApiResponse({ status: 200, description: 'Daftar proyek selesai berhasil diambil' })
  findAll(@Query('category') category?: string) {
    return this.projectsService.findAllDone(category);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Dapatkan detail satu proyek selesai beserta galeri fotonya (Publik)' })
  @ApiResponse({ status: 200, description: 'Detail proyek selesai berhasil diambil' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findOneDone(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Tambah portofolio proyek selesai baru (Admin)' })
  @ApiResponse({ status: 201, description: 'Proyek selesai berhasil dibuat' })
  create(@Body() dto: CreateProjectDoneDto) {
    return this.projectsService.createDone(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: 'Update data proyek selesai (Admin)' })
  @ApiResponse({ status: 200, description: 'Proyek selesai berhasil diperbarui' })
  update(@Param('id') id: string, @Body() dto: UpdateProjectDoneDto) {
    return this.projectsService.updateDone(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Hapus proyek selesai (Admin)' })
  @ApiResponse({ status: 200, description: 'Proyek selesai berhasil dihapus' })
  remove(@Param('id') id: string) {
    return this.projectsService.removeDone(id);
  }
}

@ApiTags('Ongoing Projects')
@Controller('ongoing-projects')
export class OngoingProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Dapatkan daftar proyek yang sedang berjalan (Publik)' })
  @ApiResponse({ status: 200, description: 'Daftar ongoing projects berhasil diambil' })
  findAll() {
    return this.projectsService.findAllOngoing();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Dapatkan detail satu proyek berjalan (Publik)' })
  @ApiResponse({ status: 200, description: 'Detail proyek berjalan berhasil diambil' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findOneOngoing(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Tambah proyek berjalan baru (Admin)' })
  @ApiResponse({ status: 201, description: 'Proyek berjalan berhasil dibuat' })
  create(@Body() dto: CreateOngoingProjectDto) {
    return this.projectsService.createOngoing(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: 'Update progres proyek berjalan (Admin)' })
  @ApiResponse({ status: 200, description: 'Proyek berjalan berhasil diperbarui' })
  update(@Param('id') id: string, @Body() dto: UpdateOngoingProjectDto) {
    return this.projectsService.updateOngoing(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Hapus proyek berjalan (Admin)' })
  @ApiResponse({ status: 200, description: 'Proyek berjalan berhasil dihapus' })
  remove(@Param('id') id: string) {
    return this.projectsService.removeOngoing(id);
  }
}
