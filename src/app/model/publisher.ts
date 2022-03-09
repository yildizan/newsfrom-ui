import { FilterableModel } from "./base";

export class Publisher extends FilterableModel {
  
  constructor(publisher: Publisher) {
    super();
    this.id = publisher.id;
    this.name = publisher.name;
    this.visible = true;
  }

}