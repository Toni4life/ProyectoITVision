import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SegundafaseService {
  private apiUrl = 'http://localhost:3000/segundafase';

  constructor(private http: HttpClient) {}

  getSegundafase(numerobastidor: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${numerobastidor}`);
  }

  createSegundafase(segundafase: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, segundafase, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
