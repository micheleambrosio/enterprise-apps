import { randomUUID } from 'crypto';
import { BaseEntity, BaseEntityProps } from './base.entity';

export interface ThumbnailEntityProps extends BaseEntityProps {
  url: string;
}

export class ThumbnailEntity extends BaseEntity {
  private url: ThumbnailEntityProps['url'];

  private constructor(data: ThumbnailEntityProps) {
    super(data);
  }

  static createNew(
    data: Omit<ThumbnailEntityProps, 'id' | 'createdAt' | 'updatedAt'>,
    id = randomUUID(),
  ) {
    return new ThumbnailEntity({
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static createExisting(data: ThumbnailEntityProps) {
    return new ThumbnailEntity({
      id: data.id,
      url: data.url,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  getUrl() {
    return this.url;
  }

  serialize() {
    return {
      id: this.id,
      url: this.url,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
