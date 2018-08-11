import { Chance } from 'chance';

import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from '../../../../environments/environment';
import { ApiService } from './api.service';

describe('ApiService', () => {
  const chance = new Chance();

  let httpMock: HttpTestingController;
  let injector: TestBed;
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });

    injector = getTestBed();
    httpMock = injector.get(HttpTestingController);
    service = injector.get(ApiService);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('request()', () => {
    describe('GET and DELETE requests', () => {
      it('converts the params to a query string', () => {
        const _id = chance.hash();

        const method = 'get';
        const path = '/users';
        const params = {
          where: { _id }
        };

        service.request(method, path, params).then((res) => {
          expect(res.length).toBe(1);
          expect(res[0]._id).toBe(_id);
        });

        const req = httpMock.expectOne(r => r.url === `${environment.api}${path}`);
        expect(req.request.method).toBe('GET');
        req.flush([{ _id }]);
      });
    });

    describe('POST and PUT requests', () => {
      it('passes the params as the body', () => {
        const _id = chance.hash();

        const method = 'post';
        const path = '/users';
        const params = { _id };

        service.request(method, path, params).then((res) => {
          expect(res._id).toBe(_id);
        });

        const req = httpMock.expectOne(`${environment.api}${path}`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(params);
        req.flush({ _id });
      });
    });
  });
});
