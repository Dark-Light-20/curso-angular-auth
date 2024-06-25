import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { TokenService } from './token.service';
import { ResponseLogin } from '@models/auth.model';
import { User } from '@models/user.model';
import { checkToken } from '@interceptors/token.interceptor';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _http = inject(HttpClient);
  private readonly _tokenService = inject(TokenService);
  private readonly _apiUrl = environment.API_URL;

  readonly user$ = new BehaviorSubject<User | null>(null);

  login(email: string, password: string) {
    return this._http
      .post<ResponseLogin>(`${this._apiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          this._tokenService.saveToken(response.access_token);
          this._tokenService.saveRefreshToken(response.refresh_token);
        })
      );
  }

  refreshToken(refreshToken: string) {
    return this._http
      .post<ResponseLogin>(`${this._apiUrl}/auth/refresh-token`, {
        refreshToken,
      })
      .pipe(
        tap((response) => {
          this._tokenService.saveToken(response.access_token);
          this._tokenService.saveRefreshToken(response.refresh_token);
        })
      );
  }

  register(name: string, email: string, password: string) {
    return this._http.post(`${this._apiUrl}/auth/register`, {
      name,
      email,
      password,
    });
  }

  registerAndLogin(name: string, email: string, password: string) {
    return this.register(name, email, password).pipe(
      switchMap(() => this.login(email, password))
    );
  }

  isAvailable(email: string) {
    return this._http.post<{ isAvailable: boolean }>(
      `${this._apiUrl}/auth/is-available`,
      {
        email,
      }
    );
  }

  recovery(email: string) {
    return this._http.post(`${this._apiUrl}/auth/recovery`, {
      email,
    });
  }

  changePassword(token: string, newPassword: string) {
    return this._http.post(`${this._apiUrl}/auth/change-password`, {
      token,
      newPassword,
    });
  }

  logout() {
    this._tokenService.removeToken();
  }

  getProfile() {
    return this._http
      .get<User>(`${this._apiUrl}/auth/profile`, { context: checkToken() })
      .pipe(tap((user) => this.user$.next(user)));
  }
}
