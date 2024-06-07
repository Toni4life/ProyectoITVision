// login.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:3000/login'; // URL del endpoint de login en el backend

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  /**
   * Envía el usuario y contraseña al backend para autenticación.
   * @param {string} usuario - El nombre de usuario.
   * @param {string} contraseña - La contraseña del usuario.
   * @returns {Observable<any>} Un observable con la respuesta de la autenticación.
   */
  login(usuario: string, contraseña: string): Observable<any> {
    return this.http.post(this.apiUrl, { usuario, contraseña });
  }

  /**
   * Almacena el nombre de usuario en una cookie.
   * @param {string} usuario - El nombre de usuario a almacenar.
   */
  setUsuarioCookie(usuario: string) {
    this.cookieService.set('usuario', usuario);
  }

  /**
   * Obtiene el nombre de usuario desde la cookie.
   * @returns {string | undefined} El nombre de usuario almacenado en la cookie, o undefined si no existe.
   */
  getUsuarioCookie(): string | undefined {
    return this.cookieService.get('usuario');
  }

  /**
   * Obtiene el rol del usuario ingresado.
   * @param {string} usuario - El nombre de usuario.
   * @returns {Observable<any>} Un observable con el rol del usuario.
   */
  obtenerRol(usuario: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${usuario}`);
  }
}

