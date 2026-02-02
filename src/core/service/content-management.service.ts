import { Injectable } from '@nestjs/common';
import { ContentEntity } from '../entity/content.entity';
import { ContentType } from '@prisma/client';
import { MovieEntity } from '../entity/movie.entity';
import { VideoEntity } from '../entity/video.entity';
import { ThumbnailEntity } from '../entity/thumbnail.entity';
import { ContentRepository } from '../../persistence/repository/content.repository';

export interface CreateContentData {
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  sizeInKb: number;
}

@Injectable()
export class ContentManagementService {
  constructor(private readonly contentRepository: ContentRepository) {}

  async createContent(data: CreateContentData) {
    const content = ContentEntity.createNew({
      title: data.title,
      description: data.description,
      type: ContentType.MOVIE,
      media: MovieEntity.createNew({
        video: VideoEntity.createNew({
          url: data.url,
          sizeInKb: data.sizeInKb,
          duration: 100,
        }),
        thumbnail: ThumbnailEntity.createNew({
          url: data.thumbnailUrl,
        }),
      }),
    });

    await this.contentRepository.create(content);
    return content;
  }
}
