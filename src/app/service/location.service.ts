import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '../model/location';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http : HttpClient) { }

  list() {
    return this.http.get<Location[]>(`${environment.apiUrl}/location/country`);
  }
}
