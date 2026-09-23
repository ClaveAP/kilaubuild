import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateStatisticDto } from './dto/create-statistic.dto.js';
import { UpdateStatisticDto } from './dto/update-statistic.dto.js';

@Injectable()
export class StatisticsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.statistic.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const statistic = await this.prisma.statistic.findUnique({
      where: { id },
    });

    if (!statistic) {
      throw new NotFoundException(`Data statistik dengan ID ${id} tidak ditemukan`);
    }

    return statistic;
  }

  async create(dto: CreateStatisticDto) {
    return this.prisma.statistic.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateStatisticDto) {
    await this.findOne(id);
    return this.prisma.statistic.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.statistic.delete({
      where: { id },
    });
  }
}
