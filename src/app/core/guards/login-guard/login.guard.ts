import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { IdentityService } from '@app/core/authentication';

@Injectable()
export class LoginGuard implements CanActivate {

  constructor(private identityService: IdentityService, private router: Router) {}

  async canActivate() {
    if (this.identityService.token) {
      const user = await this.identityService.validateToken();

      if (!user) {
        this.router.navigateByUrl('/login');
        return false;
      }

      return true;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }

  canActivateChild() {
    return Boolean(this.identityService.token);
  }

}
