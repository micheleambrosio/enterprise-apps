import { randomUUID } from 'crypto';
import { BaseEntity, BaseEntityProps } from './base.entity';
import { MovieEntity } from './movie.entity';

export interface ContentEntityProps extends BaseEntityProps {
  media?: MovieEntity;
  type: ContentType;
  title: string;
  description: string;
}

export const ContentType: { [key: string]: 'MOVIE' | 'TV_SHOW' } = {
  MOVIE: 'MOVIE',
  TV_SHOW: 'TV_SHOW',
};

export type ContentType = (typeof ContentType)[keyof typeof ContentType];

export class ContentEntity extends BaseEntity {
  private media?: ContentEntityProps['media'];
  private type: ContentEntityProps['type'];
  private title: ContentEntityProps['title'];
  private description: ContentEntityProps['description'];

  private constructor(data: ContentEntityProps) {
    super(data);
  }

  static createNew(
    data: Omit<ContentEntityProps, 'id' | 'createdAt' | 'updatedAt'>,
    id = randomUUID(),
  ) {
    return new ContentEntity({
      id,
      media: data.media,
      type: data.type,
      title: data.title,
      description: data.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static createFrom(data: ContentEntityProps) {
    return new ContentEntity({
      id: data.id,
      media: data.media,
      type: data.type,
      title: data.title,
      description: data.description,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  serialize() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      media: this.media?.serialize(),
      type: this.type,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  addMedia(media: MovieEntity) {
    this.media = media;
  }

  getMedia() {
    return this.media;
  }

  getType() {
    return this.type;
  }

  getTitle() {
    return this.title;
  }

  getDescription() {
    return this.description;
  }
}
