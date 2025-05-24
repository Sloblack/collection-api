import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { format } from 'date-fns-tz';

@Injectable()
export class DateTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        if (data) {
          this.transformDates(data);
        }
        return data;
      }),
    );
  }

  private transformDates(data: any) {
    if (data instanceof Array) {
      data.forEach(item => this.transformDates(item));
    } else if (data instanceof Object) {
      Object.keys(data).forEach(key => {
        if (data[key] instanceof Date) {
          // Convertir a tu zona horaria (ajusta 'America/Mexico_City' a tu zona)
          data[key] = format(data[key], "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", {
            timeZone: 'America/Mexico_City',
          });
        } else if (typeof data[key] === 'object' && data[key] !== null) {
          this.transformDates(data[key]);
        }
      });
    }
  }
}