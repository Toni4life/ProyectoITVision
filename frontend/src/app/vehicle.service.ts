import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = 'http://localhost:3000'; // URL base de la API
  private vehicleSource = new BehaviorSubject<any>(null);
  currentVehicle = this.vehicleSource.asObservable();

  constructor(private http: HttpClient) {}

  getVehiculos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/vehiculos/listos`);
  }

  getVehiculosInformes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/vehiculos/inspeccionados`);
  }

  changeVehicle(vehicle: any) {
    this.vehicleSource.next(vehicle);
  }
}
