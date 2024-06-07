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

  // Nuevo método para obtener la primera fase por número de bastidor
  getPrimerafase(numerobastidor: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${numerobastidor}`);
  }
}
