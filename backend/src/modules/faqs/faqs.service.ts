import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateFaqDto } from './dto/create-faq.dto.js';
import { UpdateFaqDto } from './dto/update-faq.dto.js';

@Injectable()
export class FaqsService {
  constructor(private prisma: PrismaService) {}

  async findAll(onlyActive: boolean = false) {
    return this.prisma.faq.findMany({
      where: onlyActive ? { isActive: true } : undefined,
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const faq = await this.prisma.faq.findUnique({
      where: { id },
    });

    if (!faq) {
      throw new NotFoundException(`Item FAQ dengan ID ${id} tidak ditemukan`);
    }

    return faq;
  }

  async create(dto: CreateFaqDto) {
    return this.prisma.faq.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateFaqDto) {
    await this.findOne(id);
    return this.prisma.faq.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.faq.delete({
      where: { id },
    });
  }
}
