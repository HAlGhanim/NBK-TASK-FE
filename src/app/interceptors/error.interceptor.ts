import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../services/component-services/toast.service';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error(`HTTP Error: ${error.status}`, error.message);
      toast.error('Something went wrong. Check console and try again.');
      return throwError(() => error);
    })
  );
};
