import { FilterableModel } from './base';
import { News } from './news';

export class Category extends FilterableModel {

  background: string;
  icon: string;
  displayOrder: number;
  
  // transient
  newsList: News[];

  constructor(category: Category) {
    super();
    this.id = category.id;
    this.name = category.name;
    this.background = category.background;
    this.icon = category.icon;
    this.displayOrder = category.displayOrder;
    this.visible = true;
  }

}