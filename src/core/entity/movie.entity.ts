import { BaseEntityProps } from './base.entity';

export interface MovieEntityProps extends BaseEntityProps {
  video: VideoEntity;
  thumbnail?: ThumbnailEntity;
}
