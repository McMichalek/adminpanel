// src/app/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  /**
   * Dla każdego wychodzącego requestu:
   * 1) pobierz aktualny Firebase ID Token (asynchronicznie)
   * 2) jeśli jest, dołącz go jako "Authorization: Bearer <token>"
   * 3) wyślij zmodyfikowany request do następnego handlera
   */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // 'from' konwertuje Promise<UserTokens> na Observable<UserTokens>
    return from(this.authService.getUserToken()).pipe(
      switchMap(({ idToken }) => {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        return next.handle(authReq);
      })
    );
  }
}
