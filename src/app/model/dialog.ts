import { Category } from "./category";
import { Publisher } from "./publisher";

export class FilterPayload {

  categories: Category[];
  publishers: Publisher[];
  keywords: string[];

  constructor(categories: Category[], publishers: Publisher[], keywords: string[]) {
    this.categories = categories;
    this.publishers = publishers;
    this.keywords = keywords;
  }

};