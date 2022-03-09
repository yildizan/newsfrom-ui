import { Location } from "./location";

export class News {
  
  id: number;
  title: string;
  description: string;
  link: string;
  thumbnailUrl: string;
  publishDate: number;
  location: Location;
  isArchived;

  // transient
  categoryId: number;
  publisherName: string;
  isRead: boolean;
  index: number;

}
