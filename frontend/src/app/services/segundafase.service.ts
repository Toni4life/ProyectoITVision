import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class SegundafaseService {
  private apiUrl = 'http://localhost:3000/segundafase';

  constructor(private http: HttpClient) {}

  createSegundafase(segundafase: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, segundafase, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

}
