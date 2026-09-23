import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateTestimonyDto } from './dto/create-testimony.dto.js';
import { UpdateTestimonyDto } from './dto/update-testimony.dto.js';

@Injectable()
export class TestimoniesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.testimony.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const testimony = await this.prisma.testimony.findUnique({
      where: { id },
    });

    if (!testimony) {
      throw new NotFoundException(`Testimoni dengan ID ${id} tidak ditemukan`);
    }

    return testimony;
  }

  async create(dto: CreateTestimonyDto) {
    return this.prisma.testimony.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateTestimonyDto) {
    await this.findOne(id);
    return this.prisma.testimony.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.testimony.delete({
      where: { id },
    });
  }
}
