import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { IdentityService } from '@app/core/authentication';
import { AuthenticationService } from '@app/core/http';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

  constructor(private authenticationService: AuthenticationService,
              public identityService: IdentityService,
              public router: Router) {}

  public logout() {
    this.authenticationService.logout();
  }

}
