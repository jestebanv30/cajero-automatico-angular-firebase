import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../service/auth.service";

export const authWithoutGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = localStorage.getItem("currentUser");

  if (!user) {
    router.navigateByUrl('/auth/login');
    return false;
  }
  return true;
};
