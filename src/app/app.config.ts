import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { AuthInterceptor } from './interceptors/authentication.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { CacheInterceptor } from './interceptors/cache.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([AuthInterceptor, ErrorInterceptor, CacheInterceptor])
    ),
    provideRouter(routes),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    CookieService,
  ],
};
