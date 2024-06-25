import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpContextToken,
  HttpContext,
} from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { TokenService } from '@services/token.service';
import { AuthService } from '@services/auth.service';

const CHECK_TOKEN = new HttpContextToken<boolean>(() => false);

export function checkToken() {
  return new HttpContext().set(CHECK_TOKEN, true);
}

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private readonly _tokenService = inject(TokenService);
  private readonly _authService = inject(AuthService);

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.context.get(CHECK_TOKEN)) {
      const isValidToken = this._tokenService.isValidToken();
      if (isValidToken) {
        return this.addToken(request, next);
      } else {
        return this.updateAccessTokenAndRefreshToken(request, next);
      }
    }
    return next.handle(request);
  }

  private addToken(request: HttpRequest<unknown>, next: HttpHandler) {
    const accessToken = this._tokenService.getToken();
    if (accessToken) {
      const authRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${accessToken}`),
      });
      return next.handle(authRequest);
    }
    return next.handle(request);
  }

  private updateAccessTokenAndRefreshToken(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ) {
    const refreshToken = this._tokenService.getRefreshToken();
    const isValidRefreshToken = this._tokenService.isValidRefreshToken();
    if (refreshToken && isValidRefreshToken) {
      return this._authService
        .refreshToken(refreshToken)
        .pipe(switchMap(() => this.addToken(request, next)));
    }
    return next.handle(request);
  }
}
