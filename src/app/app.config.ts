import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { AuthInterceptor } from './interceptors/auth.interceptors';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    // ✅ Phải đăng ký interceptor như DI provider
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // provideHttpClient(withInterceptorsFromDi()),
    // AuthInterceptor
    ////provideRouter(routes),
    provideHttpClient(),
  ]
};
