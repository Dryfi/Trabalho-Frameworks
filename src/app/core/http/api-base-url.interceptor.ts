import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Deixa aqui caso você queira futuramente reescrever URLs.
 * Hoje os services já usam environment.apiBaseUrl, então este interceptor é "no-op".
 */
export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => next(req);
