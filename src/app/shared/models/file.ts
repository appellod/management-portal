import { IModel, Model } from './model';

export interface IFile extends IModel {
  diseaseId?: string;
  name?: string;
  url?: string;
}

export class File extends Model implements IFile {
  public diseaseId: string;
  public name: string;
  public url: string;

  constructor(params?: IFile) {
    super(params);
  }
}
