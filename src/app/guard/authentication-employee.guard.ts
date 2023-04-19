import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {AuthenticationService} from '../service/authentication.service';
import {Role} from '../enum/role.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationEmployeeGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService,
              private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.isUserAuthenticated();
  }

  private isUserAuthenticated(): boolean {
    if (this.authenticationService.isUserLoggedIn() &&
      (this.authenticationService.getUserFromLocalCache().role === Role.ROLE_EMPLOYEE || this.authenticationService.getUserFromLocalCache().role === Role.ROLE_ADMIN)) {
      return true;
    }
    this.router.navigate(['/home']);
    return false;
  }
}
