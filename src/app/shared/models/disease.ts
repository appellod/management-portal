import { IModel, Model } from './model';

export interface IDisease extends IModel {
  name?: string;
}

export class Disease extends Model implements IDisease {
  public name: string;

  constructor(params?: IDisease) {
    super(params);
  }
}
