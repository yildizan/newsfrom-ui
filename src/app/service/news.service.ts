import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { News } from '../model/news';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http : HttpClient) { }

  list() {
    return this.http.get<News[]>(`${environment.apiUrl}/news/list`);
  }

  get(id: number) {
    return this.http.get<News>(`${environment.apiUrl}/news/get/${id}`);
  }
}
