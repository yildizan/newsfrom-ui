import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Feed } from '../model/feed';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  constructor(private http : HttpClient) { }

  fetch() {
    return this.http.get<Feed[]>(`${environment.apiUrl}/feed`);
  }

}
