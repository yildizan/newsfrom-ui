import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Publisher } from '../model/publisher';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {

  constructor(private http : HttpClient) { }

  list() {
    return this.http.get<Publisher[]>(`${environment.apiUrl}/publisher/list`);
  }
}
