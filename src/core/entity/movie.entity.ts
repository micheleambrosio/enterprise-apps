import { randomUUID } from 'crypto';
import { BaseEntity, BaseEntityProps } from './base.entity';
import { VideoEntity } from './video.entity';
import { ThumbnailEntity } from './thumbnail.entity';

export interface MovieEntityProps extends BaseEntityProps {
  video: VideoEntity;
  thumbnail?: ThumbnailEntity;
}

export class MovieEntity extends BaseEntity {
  private video: MovieEntityProps['video'];
  private thumbnail?: MovieEntityProps['thumbnail'];

  private constructor(data: MovieEntityProps) {
    super(data);
  }

  static createNew(
    data: Omit<MovieEntityProps, 'id' | 'createdAt' | 'updatedAt'>,
    id = randomUUID(),
  ) {
    return new MovieEntity({
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static createFrom(data: MovieEntityProps) {
    return new MovieEntity({
      id: data.id,
      video: data.video,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  serialize() {
    return {
      id: this.id,
      video: this.video.serialize(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
  addVideo(video: VideoEntity) {
    this.video = video;
  }

  getVideo() {
    return this.video;
  }

  addThumbnail(thumbnail: ThumbnailEntity) {
    this.thumbnail = thumbnail;
  }

  getThumbnail() {
    return this.thumbnail;
  }
}
