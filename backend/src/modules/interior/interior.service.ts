import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateInteriorDto } from './dto/create-interior.dto.js';
import { UpdateInteriorDto } from './dto/update-interior.dto.js';

@Injectable()
export class InteriorService {
  constructor(private prisma: PrismaService) {}

  async findAll(roomType?: string) {
    return this.prisma.desainInterior.findMany({
      where: roomType ? { roomType: { equals: roomType, mode: 'insensitive' } } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.desainInterior.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException(`Item desain interior dengan ID ${id} tidak ditemukan`);
    }

    return item;
  }

  async create(dto: CreateInteriorDto) {
    return this.prisma.desainInterior.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateInteriorDto) {
    await this.findOne(id);
    return this.prisma.desainInterior.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.desainInterior.delete({
      where: { id },
    });
  }
}
