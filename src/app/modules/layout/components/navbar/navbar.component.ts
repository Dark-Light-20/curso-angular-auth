import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  faBell,
  faInfoCircle,
  faClose,
  faAngleDown,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  faBell = faBell;
  faInfoCircle = faInfoCircle;
  faClose = faClose;
  faAngleDown = faAngleDown;

  isOpenOverlayAvatar = false;
  isOpenOverlayBoards = false;

  readonly user$ = this._authService.user$;

  logout() {
    this._authService.logout();
    this._router.navigateByUrl('/login');
  }
}
