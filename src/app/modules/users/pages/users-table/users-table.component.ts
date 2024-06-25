import { Component, OnInit, inject } from '@angular/core';

import { DataSourceUser } from './data-source';
import { UsersService } from '@services/users.service';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
})
export class UsersTableComponent implements OnInit {
  private readonly _usersService = inject(UsersService);
  private readonly _authService = inject(AuthService);

  dataSource = new DataSourceUser();
  columns: string[] = ['id', 'avatar', 'name', 'email'];

  readonly user$ = this._authService.user$;

  ngOnInit(): void {
    this._usersService
      .getUsers()
      .subscribe((users) => this.dataSource.init(users));
  }
}
