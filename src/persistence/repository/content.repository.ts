import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/persistence/prisma/prisma.service';
import { ContentEntity } from '../../core/entity/content.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class ContentRepository {
  private readonly model: PrismaService['content'];

  constructor(prismaService: PrismaService) {
    this.model = prismaService.content;
  }

  // Recebe uma entidade
  // Retorna uma entidade
  async create(content: ContentEntity) {
    try {
      const movie = content.getMedia();

      if (!movie) {
        throw new Error('Movie is required');
      }

      const video = movie.getVideo();

      if (!video) {
        throw new Error('Video is required');
      }

      await this.model.create({
        data: {
          id: content.getId(),
          title: content.getTitle(),
          description: content.getDescription(),
          type: content.getType(),
          createdAt: content.getCreatedAt(),
          updatedAt: content.getUpdatedAt(),
          movie: {
            create: {
              id: movie.getId(),
              video: {
                create: video.serialize(),
              },
              thumbnail: {
                create: movie.getThumbnail()?.serialize(),
              },
            },
          },
        },
      });

      return content;
    } catch (e) {
      this.handleAndThrowError(e);
    }
  }

  private extractErrorMessage(error: unknown) {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return 'An unexpected error occurred';
  }

  protected handleAndThrowError(error: unknown) {
    const errorMessage = this.extractErrorMessage(error);

    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new Error(error.message);
    }

    throw new Error(errorMessage);
  }
}
