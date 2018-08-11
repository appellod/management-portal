import { IModel, Model } from './model';

export interface IUser extends IModel {
  email?: string;
  level?: number;
  password?: string;
}

export class User extends Model implements IUser {
  public email: string;
  public level: number;
  public readonly levels = [
    'Regular User',
    'Administrator'
  ];
  public password: string;

  constructor(params?: IUser) {
    super(params);
  }
}
