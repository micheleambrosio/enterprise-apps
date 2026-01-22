import { BaseEntityProps } from './base.entity';

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
