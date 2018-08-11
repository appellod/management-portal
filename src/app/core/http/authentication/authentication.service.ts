import { EventEmitter, Injectable } from '@angular/core';

import { ApiService } from '@app/core/http/api/api.service';
import { User } from '@app/shared/models';

export interface IOnLogin {
  token: string;
  user: User;
}

@Injectable()
export class AuthenticationService {

  public onLogin = new EventEmitter<IOnLogin>();
  public onLogout = new EventEmitter();

  constructor(private apiService: ApiService) { }

  public async checkAvailability(email: string): Promise<boolean> {
    const method = 'get';
    const path = '/v1/authentication/availability';
    const params = { email };

    const res = await this.apiService.request(method, path, params);

    return res.isAvailable;
  }

  public async signup(email: string, password: string): Promise<User> {
    const method = 'post';
    const path = '/v1/authentication/signup';
    const params = { email, password };

    const res = await this.apiService.request(method, path, params);
    this.onLogin.emit(res);

    return new User(res.user);
  }

  public async login(email: string, password: string): Promise<User> {
    const method = 'post';
    const path = '/v1/authentication/login';
    const params = { email, password };

    const res = await this.apiService.request(method, path, params);
    this.onLogin.emit(res);

    return new User(res.user);
  }

  public async logout(): Promise<void> {
    const method = 'delete';
    const path = '/v1/authentication/logout';

    const res = await this.apiService.request(method, path, null);
    this.onLogout.emit();

    return res;
  }

  public async requestPasswordReset(email: string): Promise<void> {
    const method = 'post';
    const path = '/v1/authentication/request-password-reset';
    const params = { email };

    return this.apiService.request(method, path, params);
  }

  public async resetPassword(resetHash: string, password: string): Promise<void> {
    const method = 'post';
    const path = '/v1/authentication/reset-password';
    const params = { resetHash, password };

    return this.apiService.request(method, path, params);
  }

  public async validateToken(token: string): Promise<User> {
    const method = 'get';
    const path = '/v1/authentication/validate-token';
    const params = { token };

    const res = await this.apiService.request(method, path, params);

    return new User(res.user);
  }

}
