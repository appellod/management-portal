import { Title } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { IdentityService } from '@app/core/authentication';
import { AuthenticationService } from '@app/core/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(private authenticationService: AuthenticationService,
              private identityService: IdentityService,
              private router: Router,
              private titleService: Title) {
    this.authenticationService.onLogout.subscribe(this.authenticationService_onLogout.bind(this));

    this.titleService.setTitle('Example');
  }

  private authenticationService_onLogout() {
    this.router.navigateByUrl('/login');
  }

}
