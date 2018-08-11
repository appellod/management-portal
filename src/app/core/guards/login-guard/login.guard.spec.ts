import { Chance } from 'chance';

import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CoreModule } from '@app/core/core.module';
import { IdentityService } from '@app/core/authentication';
import { RouterMock } from '@app/core/mocks';
import { User } from '@app/shared/models';

import { LoginGuard } from './login.guard';


describe('LoginGuard', () => {
  const chance = new Chance();

  let identityService: IdentityService;
  let router: Router;
  let service: LoginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        HttpClientTestingModule
      ],
      providers: [
        IdentityService,
        { provide: Router, useClass: RouterMock }
      ]
    });

    identityService = TestBed.get(IdentityService);
    router = TestBed.get(Router);
    service = TestBed.get(LoginGuard);
  });

  describe('canActivate()', () => {
    describe('when user is authenticated', () => {
      beforeEach(() => {
        identityService.token = chance.hash();
        spyOn(identityService, 'validateToken').and.returnValue(Promise.resolve(new User()));
      });

      it('it returns true', async () => {
        const result = await service.canActivate();

        expect(result).toEqual(true);
      });
    });

    describe('when user is not authenticated', () => {
      it('it navigates to the login page', async () => {
        await service.canActivate();

        expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
      });

      it ('returns false', async () => {
        const result = await service.canActivate();

        expect(result).toEqual(false);
      });
    });
  });
});
