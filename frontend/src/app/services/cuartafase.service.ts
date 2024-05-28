import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class CuartafaseService {
  private apiUrl = 'http://localhost:3000/cuartafase';

  constructor(private http: HttpClient) {}

  createCuartafase(cuartafase: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, cuartafase, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

}
