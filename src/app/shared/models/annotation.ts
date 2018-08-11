import { IModel, Model } from './model';

export interface IAnnotation extends IModel {
  fileId?: string;
  height?: number;
  label?: string;
  width?: number;
  x?: number;
  y?: number;
}

export class Annotation extends Model implements IAnnotation {
  public fileId: string;
  public height: number;
  public label: string;
  public width: number;
  public x: number;
  public y: number;

  constructor(params?: IAnnotation) {
    super(params);
  }
}
