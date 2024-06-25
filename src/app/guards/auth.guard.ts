import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '@services/token.service';

export const authGuard: CanActivateFn = () => {
  const isValidToken = inject(TokenService).isValidRefreshToken();
  const router = inject(Router);
  if (!isValidToken) {
    router.navigateByUrl('/login');
    return false;
  }
  return true;
};
