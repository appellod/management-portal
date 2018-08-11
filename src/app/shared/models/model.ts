export interface IModel {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export abstract class Model implements IModel {
  public _id: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(params?: IModel) {
    params = params || {};

    Object.keys(params).forEach(key => {
      this[key] = params[key];
    });

    this.createdAt = new Date(params.createdAt);
    this.updatedAt = new Date(params.updatedAt);
  }
}
