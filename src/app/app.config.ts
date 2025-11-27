import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { apiBaseUrlInterceptor } from './core/http/api-base-url.interceptor';
import { httpErrorInterceptor } from './core/http/http-error.interceptor';
import { mockApiInterceptor } from './core/http/mock-api.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([
        apiBaseUrlInterceptor,
        httpErrorInterceptor,
        ...(isDevMode() ? [mockApiInterceptor] : []),
      ])
    ),
  ],
};
