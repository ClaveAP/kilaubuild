import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateContactDto } from './dto/create-contact.dto.js';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateContactDto) {
    const contact = await this.prisma.contact.create({
      data: dto,
    });

    return {
      message: 'Pesan berhasil terkirim. Tim KilauBuild akan segera menghubungi Anda.',
      data: contact,
    };
  }

  async findAll(isRead?: boolean) {
    return this.prisma.contact.findMany({
      where: isRead !== undefined ? { isRead } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException(`Pesan dengan ID ${id} tidak ditemukan`);
    }

    return contact;
  }

  async markAsRead(id: string) {
    await this.findOne(id);
    return this.prisma.contact.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.contact.delete({
      where: { id },
    });
  }
}
