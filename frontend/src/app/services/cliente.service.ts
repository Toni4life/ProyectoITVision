import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:3000'; // URL base del backend

  constructor(private http: HttpClient) {}

 /**
   * Obtiene los datos de un cliente por nombre de usuario.
   * @param {string} usuario - El nombre de usuario del cliente.
   * @returns {Observable<any>} Un observable con los datos del cliente.
   */
 obtenerDatosCliente(usuario: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/clientes/${usuario}`);
}

/**
 * Obtiene el ID de un cliente por nombre de usuario.
 * @param {string} usuario - El nombre de usuario del cliente.
 * @returns {Observable<any>} Un observable con el ID del cliente.
 */
obtenerClienteIdPorUsuario(usuario: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/login/${usuario}`);
}

/**
 * Obtiene los vehículos de un cliente por su ID.
 * @param {number} clienteId - El ID del cliente.
 * @returns {Observable<any>} Un observable con los datos de los vehículos del cliente.
 */
obtenerVehiculosCliente(clienteId: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/vehiculos/${clienteId}`);
}

generarPDF(numerobastidor: string): Observable<Blob> {
  return this.http.post(`${this.apiUrl}/generatepdf/${numerobastidor}`, {}, { responseType: 'blob' });
}
}
