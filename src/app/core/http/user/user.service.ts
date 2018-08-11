import { EventEmitter, Injectable } from '@angular/core';

import { ApiService, RestParameters } from '@app/core/http/api/api.service';
import { IUser, User } from '@app/shared/models';

@Injectable()
export class UserService {

  public basePath = '/v1/users';
  public onCreate = new EventEmitter<User>();
  public onRemove = new EventEmitter<User>();
  public onUpdate = new EventEmitter<User>();

  constructor(private apiService: ApiService) {}

  public async create(params: IUser): Promise<User> {
    const res = await this.apiService.request('post', this.basePath, params);

    const record = new User(res.record);
    this.onCreate.emit(record);

    return record;
  }

  public async find(params: RestParameters): Promise<User[]> {
    const res = await this.apiService.request('get', this.basePath, params);

    return res.records.map(record => new User(record));
  }

  public async findOne(_id: string): Promise<User> {
    const res = await this.apiService.request('get', `${this.basePath}/${_id}`, null);

    return new User(res.record);
  }

  public async remove(_id: string): Promise<User> {
    const res = await this.apiService.request('delete', `${this.basePath}/${_id}`, null);

    const record = new User(res.record);
    this.onRemove.emit(record);

    return record;
  }

  public async update(params: IUser): Promise<User> {
    const res = await this.apiService.request('put', `${this.basePath}/${params._id}`, params);

    const record = new User(res.record);
    this.onUpdate.emit(record);

    return record;
  }

}
