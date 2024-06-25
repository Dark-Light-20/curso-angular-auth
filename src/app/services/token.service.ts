import { Injectable, inject } from '@angular/core';
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
}
