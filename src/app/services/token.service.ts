import { Injectable, inject } from '@angular/core';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly _cookieService = inject(CookieService);

  saveToken(token: string) {
    this._cookieService.set('token-trello', token, 1, '/');
  }

  getToken() {
    const token = this._cookieService.get('token-trello');
    return token;
  }

  removeToken() {
    this._cookieService.delete('token-trello', '/');
  }

  isValidToken() {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const decodeToken = jwtDecode<JwtPayload>(token);
    if (decodeToken?.exp) {
      const tokenDate = new Date(0);
      tokenDate.setUTCSeconds(decodeToken.exp);
      const today = new Date();
      return tokenDate.getTime() > today.getTime();
    }
    return false;
  }

  saveRefreshToken(token: string) {
    this._cookieService.set('refresh-token-trello', token, 1, '/');
  }

  getRefreshToken() {
    const token = this._cookieService.get('refresh-token-trello');
    return token;
  }

  removeRefreshToken() {
    this._cookieService.delete('refresh-token-trello', '/');
  }

  isValidRefreshToken() {
    const token = this.getRefreshToken();
    if (!token) {
      return false;
    }
    const decodeToken = jwtDecode<JwtPayload>(token);
    if (decodeToken?.exp) {
      const tokenDate = new Date(0);
      tokenDate.setUTCSeconds(decodeToken.exp);
      const today = new Date();
      return tokenDate.getTime() > today.getTime();
    }
    return false;
  }
}
