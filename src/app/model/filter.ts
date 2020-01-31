export class Filter {
  id?: number;
  name?: string;
  selected?: boolean;

  public constructor(init?: Partial<Filter>) {
    Object.assign(this, init);
  }
}