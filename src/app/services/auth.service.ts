import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = environment.API_URL;

  login(email: string, password: string) {
    return this._http.post(`${this._apiUrl}/auth/login`, {
      email,
      password,
    });
  }

  register(name: string, email: string, password: string) {
    return this._http.post(`${this._apiUrl}/auth/register`, {
      name,
      email,
      password,
    });
  }

  isAvailable(email: string) {
    return this._http.post<{ isAvailable: boolean }>(
      `${this._apiUrl}/auth/is-available`,
      {
        email,
      }
    );
  }
}
