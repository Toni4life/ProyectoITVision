import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class TercerafaseService {
  private apiUrl = 'http://localhost:3000/tercerafase';

  constructor(private http: HttpClient) {}

  createTercerafase(tercerafase: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, tercerafase, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

}
