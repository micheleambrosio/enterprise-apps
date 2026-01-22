import { randomUUID } from 'crypto';
import { BaseEntity, BaseEntityProps } from './base.entity';

export type NewVideoEntity = Omit<
  VideoEntityProps,
  'id' | 'createdAt' | 'updatedAt'
>;

export interface VideoEntityProps extends BaseEntityProps {
  url: string;
  sizeInKb: number;
  duration: number; // duration in seconds
}

export class VideoEntity extends BaseEntity {
  private url: VideoEntityProps['url'];
  private sizeInKb: VideoEntityProps['sizeInKb'];
  private duration: VideoEntityProps['duration'];

  private constructor(data: VideoEntityProps) {
    super(data);
  }

  static createNew(data: NewVideoEntity, id = randomUUID()) {
    return new VideoEntity({
      id,
      url: data.url,
      sizeInKb: data.sizeInKb,
      duration: data.duration,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static createFrom(data: VideoEntityProps) {
    return new VideoEntity(data);
  }

  static getMaxFileSize() {
    const MAX_FILE_SIZE_IN_KB = 1024 * 1024 * 1024; // 1 GB
    return MAX_FILE_SIZE_IN_KB;
  }

  static getMaxThumbnailSize() {
    const MAX_THUMBNAIL_SIZE_IN_KB = 1024 * 1024 * 10; // 10 MB
    return MAX_THUMBNAIL_SIZE_IN_KB;
  }

  serialize() {
    return {
      id: this.id,
      url: this.url,
      sizeInKb: this.sizeInKb,
      duration: this.duration,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  getDuration() {
    return this.duration;
  }

  getSizeInKb() {
    return this.sizeInKb;
  }

  getUrl() {
    return this.url;
  }
}
