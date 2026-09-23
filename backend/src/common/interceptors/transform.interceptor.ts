import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode ?? 200;

    return next.handle().pipe(
      map((res) => {
        // Jika response dari service sudah membawa custom message
        const message =
          typeof res === 'object' && res !== null && 'message' in res
            ? (res as { message: string }).message
            : 'Berhasil memproses permintaan';

        const data =
          typeof res === 'object' && res !== null && 'data' in res
            ? (res as { data: T }).data
            : res;

        return {
          statusCode,
          message,
          data,
        };
      }),
    );
  }
}
