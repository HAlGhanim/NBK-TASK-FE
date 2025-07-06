import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, tap } from 'rxjs';

interface CacheEntry {
  response: HttpResponse<any>;
  lastRead: number;
}

const cache = new Map<string, CacheEntry>();
const maxAge = 1 * 60 * 1000;

export const CacheInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.urlWithParams;

  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    for (const key of cache.keys()) {
      if (key.includes('/api/customers')) {
        cache.delete(key);
      }
    }
    return next(req);
  }

  if (req.method === 'GET') {
    const cached = cache.get(url);

    if (cached && Date.now() - cached.lastRead < maxAge) {
      return of(cached.response.clone());
    }

    return next(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          cache.set(url, { response: event.clone(), lastRead: Date.now() });
        }
      })
    );
  }

  return next(req);
};
