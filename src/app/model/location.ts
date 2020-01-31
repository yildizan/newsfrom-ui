import { Filter } from './filter';

export class Location extends Filter {
  latitude?: number;
  longitude?: number;

  public constructor(init?: Partial<Location>) {
    super(init);
    Object.assign(this, init);
  }
}