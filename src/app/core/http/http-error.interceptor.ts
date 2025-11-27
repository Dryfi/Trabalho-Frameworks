import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        const msg = err.error?.message || err.message || 'Erro de comunicação com o servidor.';
        toast.error(msg);
      } else {
        toast.error('Erro inesperado.');
      }
      return throwError(() => err);
    })
  );
};
