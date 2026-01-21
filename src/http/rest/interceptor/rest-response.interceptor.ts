import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { switchMap } from 'rxjs';

export class RestResponseInterceptor<T extends object>
  implements NestInterceptor<any, T>
{
  constructor(private readonly dtoClass: new () => T) {}

  intercept(_context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      switchMap(async data => {
        const transformedData = plainToInstance(
          this.dtoClass,
          instanceToPlain(data),
          { excludeExtraneousValues: true },
        );

        const errors = await validate(transformedData);

        if (errors.length > 0) {
          throw new BadRequestException({
            message: 'Response validation failed',
            errors,
          });
        }

        return transformedData;
      }),
    );
  }
}
