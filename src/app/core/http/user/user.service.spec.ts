import { Chance } from 'chance';

import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ApiService } from '@app/core/http';
import { User } from '@app/shared/models';
import { environment } from '@env/environment';

import { UserService } from './user.service';

describe('UserService', () => {
  const chance = new Chance();

  let httpMock: HttpTestingController;
  let injector: TestBed;
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        UserService
      ]
    });

    injector = getTestBed();
    httpMock = injector.get(HttpTestingController);
    service = injector.get(UserService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('create()', () => {
    it('creates and returns a User', () => {
      const params = {
        email: chance.email(),
        password: chance.hash()
      };

      service.create(params).then((res) => {
        expect(res).toEqual(jasmine.any(User));
        expect(res._id).toBeDefined();
        expect(res.email).toEqual(params.email);
      });

      const req = httpMock.expectOne(`${environment.api}${service.basePath}`);
      expect(req.request.method).toBe('POST');
      req.flush({
        user: {
          _id: chance.hash(),
          email: params.email
        }
      });
    });
  });

  describe('find()', () => {
    it('returns an array of Users', () => {
      const _id = chance.hash();
      const params = {
        where: { _id }
      };

      service.find(params).then((res) => {
        expect(res.length).toBe(1);
        expect(res[0]).toEqual(jasmine.any(User));
        expect(res[0]._id).toBe(_id);
      });

      const req = httpMock.expectOne((r => r.url === `${environment.api}${service.basePath}`));
      expect(req.request.method).toBe('GET');
      req.flush({
        users: [
          { _id }
        ]
      });
    });
  });

  describe('findOne()', () => {
    it('returns a User', () => {
      const _id = chance.hash();

      service.findOne(_id).then((res) => {
        expect(res).toEqual(jasmine.any(User));
        expect(res._id).toBe(_id);
      });

      const req = httpMock.expectOne(`${environment.api}${service.basePath}/${_id}`);
      expect(req.request.method).toBe('GET');
      req.flush({
        user: { _id }
      });
    });
  });

  describe('remove()', () => {
    it('removes the user and returns true', () => {
      const _id = chance.hash();

      service.remove(_id).then((res) => {
        expect(res).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.api}${service.basePath}/${_id}`);
      expect(req.request.method).toBe('DELETE');
    });
  });

  describe('update()', () => {
    it('updates and returns a User', () => {
      const params = {
        _id: chance.hash(),
        email: chance.email(),
        password: chance.hash()
      };

      service.update(params).then((res) => {
        expect(res).toEqual(jasmine.any(User));
        expect(res._id).toEqual(params._id);
        expect(res.email).toEqual(params.email);
      });

      const req = httpMock.expectOne(`${environment.api}${service.basePath}/${params._id}`);
      expect(req.request.method).toBe('PUT');
      req.flush({ user: params });
    });
  });
});
