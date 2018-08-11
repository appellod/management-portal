import { Chance } from 'chance';

import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ApiService } from '@app/core/http';
import { User } from '@app/shared/models';
import { environment } from '@env/environment';

import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  const chance = new Chance();

  let httpMock: HttpTestingController;
  let injector: TestBed;
  let service: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        AuthenticationService
      ]
    });

    injector = getTestBed();
    httpMock = injector.get(HttpTestingController);
    service = injector.get(AuthenticationService);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('checkAvailability()', () => {
    describe('when the email is taken', () => {
      it('returns false', () => {
        const params = {
          email: chance.email()
        };

        service.checkAvailability(params.email).then(res => {
          expect(res).toBeFalsy();
        });

        const req = httpMock.expectOne(r => r.url === `${environment.api}/v1/authentication/availability`);
        expect(req.request.method).toEqual('GET');
        req.flush({ isAvailable: false });
      });
    });

    describe('when the email is not taken', () => {
      it('returns true', () => {
        const params = {
          email: chance.email()
        };

        service.checkAvailability(params.email).then(res => {
          expect(res).toBeTruthy();
        });

        const req = httpMock.expectOne(r => r.url === `${environment.api}/v1/authentication/availability`);
        expect(req.request.method).toEqual('GET');
        req.flush({ isAvailable: true });
      });
    });
  });

  describe('signup()', () => {
    const email = chance.email();
    const password = chance.hash();
    const token = chance.hash();

    let onLoginSpy;
    let promise;

    beforeEach(() => {
      onLoginSpy = spyOn(service.onLogin, 'emit');
      promise = service.signup(email, password);

      const req = httpMock.expectOne(`${environment.api}/v1/authentication/signup`);
      expect(req.request.method).toEqual('POST');
      req.flush({ token, user: { _id: chance.hash() } });
    });

    it('emits onLogin', () => {
      promise.then(res => {
        expect(onLoginSpy).toHaveBeenCalled();
      });
    });

    it('returns a User', () => {
      promise.then(res => {
        expect(res).toEqual(jasmine.any(User));
        expect(res._id).toBeDefined();
      });
    });
  });

  describe('login()', () => {
    const email = chance.email();
    const password = chance.hash();
    const token = chance.hash();

    let onLoginSpy;
    let promise;

    beforeEach(() => {
      onLoginSpy = spyOn(service.onLogin, 'emit');
      promise = service.login(email, password);

      const req = httpMock.expectOne(`${environment.api}/v1/authentication/login`);
      expect(req.request.method).toEqual('POST');
      req.flush({ token, user: { _id: chance.hash() } });
    });

    it('emits onLogin', () => {
      promise.then(res => {
        expect(onLoginSpy).toHaveBeenCalled();
      });
    });

    it('returns a User', () => {
      promise.then(res => {
        expect(res).toEqual(jasmine.any(User));
        expect(res._id).toBeDefined();
      });
    });
  });

  describe('logout()', () => {
    it('emits onLogout', () => {
      const onLogoutSpy = spyOn(service.onLogout, 'emit');

      service.logout().then(res => {
        expect(onLogoutSpy).toHaveBeenCalled();
      });

      const req = httpMock.expectOne(`${environment.api}/v1/authentication/logout`);
      expect(req.request.method).toEqual('DELETE');
    });
  });

  describe('requestPasswordReset()', () => {
    it('returns void', () => {
      const email = chance.email();

      service.requestPasswordReset(email).then(res => {
        expect(res).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.api}/v1/authentication/request-password-reset`);
      expect(req.request.method).toEqual('POST');
    });
  });

  describe('resetPassword()', () => {
    it('returns void', () => {
      const resetHash = chance.hash();
      const password = chance.hash();

      service.resetPassword(resetHash, password).then(res => {
        expect(res).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.api}/v1/authentication/reset-password`);
      expect(req.request.method).toEqual('POST');
    });
  });

  describe('validateToken()', () => {
    let promise;

    beforeEach(() => {
      const params = { token: chance.hash() };
      promise = service.validateToken(params.token);

      const req = httpMock.expectOne(r => r.url === `${environment.api}/v1/authentication/validate-token`);
      expect(req.request.method).toEqual('GET');
      req.flush({ user: { _id: chance.hash() } });
    });

    it('returns a User', () => {
      promise.then(res => {
        expect(res).toEqual(jasmine.any(User));
        expect(res._id).toBeDefined();
      });
    });
  });
});
