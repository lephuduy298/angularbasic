import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Clone request và thêm withCredentials để gửi cookies
  const clonedRequest = req.clone({
    withCredentials: true // Tự động gửi cookie với mọi request
  });

  return next(clonedRequest).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Token hết hạn hoặc không hợp lệ, redirect về login
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};

