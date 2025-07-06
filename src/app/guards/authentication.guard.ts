import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { isTokenExpired } from '../utils/jwt';

export const authenticationGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);

  const token = cookieService.get('token');

  const isExpired = !token || isTokenExpired(token);

  if (isExpired) {
    cookieService.delete('token');
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  return true;
};
