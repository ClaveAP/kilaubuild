import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateProjectDoneDto } from './dto/create-project-done.dto.js';
import { UpdateProjectDoneDto } from './dto/update-project-done.dto.js';
import { CreateOngoingProjectDto } from './dto/create-ongoing-project.dto.js';
import { UpdateOngoingProjectDto } from './dto/update-ongoing-project.dto.js';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  // ==========================================
  // 1. PROJECT DONE (Portofolio Selesai)
  // ==========================================
  async findAllDone(category?: string) {
    return this.prisma.projectDone.findMany({
      where: category ? { category: { equals: category, mode: 'insensitive' } } : undefined,
      include: { gallery: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneDone(id: string) {
    const project = await this.prisma.projectDone.findUnique({
      where: { id },
      include: { gallery: true },
    });

    if (!project) {
      throw new NotFoundException(`Proyek selesai dengan ID ${id} tidak ditemukan`);
    }

    return project;
  }

  async createDone(dto: CreateProjectDoneDto) {
    const { gallery, completionDate, ...rest } = dto;

    return this.prisma.projectDone.create({
      data: {
        ...rest,
        completionDate: completionDate ? new Date(completionDate) : undefined,
        gallery: gallery?.length
          ? {
              create: gallery.map((item) => ({
                imageUrl: item.imageUrl,
                caption: item.caption,
              })),
            }
          : undefined,
      },
      include: { gallery: true },
    });
  }

  async updateDone(id: string, dto: UpdateProjectDoneDto) {
    await this.findOneDone(id);
    const { gallery, completionDate, ...rest } = dto;

    // Jika user mengupdate gallery, ganti relasi galeri lama
    if (gallery !== undefined) {
      await this.prisma.projectImage.deleteMany({
        where: { projectDoneId: id },
      });
    }

    return this.prisma.projectDone.update({
      where: { id },
      data: {
        ...rest,
        completionDate: completionDate ? new Date(completionDate) : undefined,
        gallery: gallery?.length
          ? {
              create: gallery.map((item) => ({
                imageUrl: item.imageUrl,
                caption: item.caption,
              })),
            }
          : undefined,
      },
      include: { gallery: true },
    });
  }

  async removeDone(id: string) {
    await this.findOneDone(id);
    return this.prisma.projectDone.delete({
      where: { id },
    });
  }

  // ==========================================
  // 2. ONGOING PROJECT (Proyek Sedang Berjalan)
  // ==========================================
  async findAllOngoing() {
    return this.prisma.ongoingProject.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneOngoing(id: string) {
    const project = await this.prisma.ongoingProject.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Proyek berjalan dengan ID ${id} tidak ditemukan`);
    }

    return project;
  }

  async createOngoing(dto: CreateOngoingProjectDto) {
    return this.prisma.ongoingProject.create({
      data: dto,
    });
  }

  async updateOngoing(id: string, dto: UpdateOngoingProjectDto) {
    await this.findOneOngoing(id);
    return this.prisma.ongoingProject.update({
      where: { id },
      data: dto,
    });
  }

  async removeOngoing(id: string) {
    await this.findOneOngoing(id);
    return this.prisma.ongoingProject.delete({
      where: { id },
    });
  }
}
