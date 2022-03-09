import { Category } from "./category";
import { News } from "./news";
import { Publisher } from "./publisher";

export class Feed {

  id: number;
  category: Category;
  publisher: Publisher;
  newsList: News[];

}