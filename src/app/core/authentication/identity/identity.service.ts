import { Injectable } from '@angular/core';

import { AuthenticationService, IOnLogin, UserService } from '@app/core/http';
import { User } from '@app/shared/models';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {

  public token: string;
  public user: User = new User();

  constructor(private authenticationService: AuthenticationService,
              private userService: UserService) {
    this.authenticationService.onLogin.subscribe(this.login.bind(this));
    this.authenticationService.onLogout.subscribe(this.logout.bind(this));
    this.userService.onUpdate.subscribe(this.updateUser.bind(this));

    this.token = localStorage.getItem('token');
  }

  public clear() {
    this.token = null;
    this.user = null;
  }

  public async validateToken() {
    try {
      this.user = await this.authenticationService.validateToken(this.token);
      return this.user;
    } catch (e) {
      this.clear();
    }
  }

  private login(data: IOnLogin) {
    this.setToken(data.token);
    this.user = data.user;
  }

  private logout() {
    this.removeToken();
    this.user = new User();
  }

  private removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  private updateUser(user: User) {
    if (user._id === this.user._id) {
      this.user = user;
    }
  }
}
