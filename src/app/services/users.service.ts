import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { User } from '@models/user.model';
import { TokenService } from './token.service';
import { checkToken } from '@interceptors/token.interceptor';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly _http = inject(HttpClient);
  private readonly _tokenService = inject(TokenService);
  private readonly _apiUrl = environment.API_URL;

  getUsers() {
    return this._http.get<User[]>(`${this._apiUrl}/users`, {
      context: checkToken(),
    });
  }
}
