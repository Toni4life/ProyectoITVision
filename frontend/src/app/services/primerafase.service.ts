import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class PrimerafaseService {
  private apiUrl = 'http://localhost:3000/primerafase';

  constructor(private http: HttpClient) {}

  createPrimerafase(primerafase: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, primerafase, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

}
