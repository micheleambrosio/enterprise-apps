import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContentData } from '../../core/service/content-management.service';
import { randomUUID } from 'crypto';

@Injectable()
export class VideoDAO {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateContentData) {
    const { title, description, url, thumbnailUrl, sizeInKb } = data;

    return this.prismaService.video.create({
      data: {
        id: randomUUID(),
        title,
        description,
        url,
        thumbnailUrl,
        sizeInKb,
        duration: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }
}
