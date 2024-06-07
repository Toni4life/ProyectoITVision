// registro.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private apiUrl = 'http://localhost:3000'; // URL del endpoint de login en el backend

  constructor(private http: HttpClient) {}

/**
   * Envía el nombre de usuario al backend para verificar si existe.
   * @param {string} usuario - El nombre de usuario.
   * @returns {Observable<any>} Un observable con la respuesta de la verificación.
   */
login(usuario: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/login1`, { usuario });
}

/**
 * Envía el número de teléfono, DNI y correo electrónico al backend para verificar si existen.
 * @param {string} numero_telefono - El número de teléfono del cliente.
 * @param {string} dni - El DNI del cliente.
 * @param {string} correo_electronico - El correo electrónico del cliente.
 * @returns {Observable<any>} Un observable con la respuesta de la verificación.
 */
clientes(numero_telefono: string, dni: string, correo_electronico: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/clientes`, { numero_telefono, dni, correo_electronico });
}

/**
 * Inserta un nuevo usuario en la tabla de login en el backend.
 * @param {string} usuario - El nombre de usuario.
 * @param {string} contraseña - La contraseña del usuario.
 * @param {number} clienteid - El ID del cliente asociado.
 * @returns {Observable<any>} Un observable con la respuesta de la inserción.
 */
insertarLogin(usuario: string, contraseña: string, clienteid: number): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/login2`, { usuario, contraseña, clienteid });
}

/**
 * Inserta un nuevo cliente en la base de datos.
 * @param {string} nombre - El nombre del cliente.
 * @param {string} apellidos - Los apellidos del cliente.
 * @param {string} fechaNacimiento - La fecha de nacimiento del cliente.
 * @param {string} telefono - El número de teléfono del cliente.
 * @param {string} dni - El DNI del cliente.
 * @param {string} direccion - La dirección del cliente.
 * @param {string} email - El correo electrónico del cliente.
 * @returns {Observable<any>} Un observable con la respuesta de la inserción.
 */
insertarCliente(nombre: string, apellidos: string, fechaNacimiento: string, telefono: string, dni: string, direccion: string, email: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/clientes2`, { nombre, apellidos, fechaNacimiento, telefono, dni, direccion, email });
}
}