import { Filter } from './filter';

export class Category extends Filter {
  background?: string;
  icon?: string;
  displayOrder?: number;

  public constructor(init?: Partial<Category>) {
    super(init);
    Object.assign(this, init);
  }
}