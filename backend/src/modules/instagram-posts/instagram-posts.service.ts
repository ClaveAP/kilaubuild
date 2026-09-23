import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateInstagramPostDto } from './dto/create-post.dto.js';
import { UpdateInstagramPostDto } from './dto/update-post.dto.js';

@Injectable()
export class InstagramPostsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.instagramPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const post = await this.prisma.instagramPost.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post Instagram dengan ID ${id} tidak ditemukan`);
    }

    return post;
  }

  async create(dto: CreateInstagramPostDto) {
    return this.prisma.instagramPost.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateInstagramPostDto) {
    await this.findOne(id);
    return this.prisma.instagramPost.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.instagramPost.delete({
      where: { id },
    });
  }
}
