import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../services/login.service';
import { FormsModule, NgForm } from '@angular/forms'; //
import { Router } from '@angular/router'; 
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [FormsModule ,CommonModule,ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle]
})
export class LoginComponent {
  usuario: string = '';
  contrasenia: string = '';
  errorMessage: string = '';
  @ViewChild('passwordInput') passwordInput: ElementRef | undefined;

  constructor(private loginService: LoginService, private router: Router) {}

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.loginService.login(this.usuario, this.contrasenia).subscribe(
        (response) => {
          if (response.success) {
            // Si el inicio de sesión es exitoso, almacenar el usuario en una cookie
            this.loginService.setUsuarioCookie(this.usuario);

            // Llamar a la función para obtener el rol del usuario
            this.obtenerRol();
          } else {
            // Si hay un error en el inicio de sesión, mostrar el mensaje de error
            this.errorMessage = 'Error de conexión';
          }
        },
        (error) => {
          if (error.status === 401 || error.status === 403) {
            // Si hay un error 401 o 403, es decir, usuario o contraseña incorrectos
            this.errorMessage = 'Error de usuario o contraseña';
          } else {
            // Si hay otro tipo de error, mostrar un mensaje genérico de error de solicitud
            this.errorMessage = 'Error en la solicitud de inicio';
            if (this.passwordInput) {
              this.passwordInput.nativeElement.value = '';
            }
          }
          console.error('Error en la solicitud de inicio de sesión:', error);
          if (this.passwordInput) {
            this.passwordInput.nativeElement.value = '';
          }
        }
      );
    }
  }

  obtenerRol(): void {
    // Llamar al servicio para obtener el rol del usuario
    this.loginService.obtenerRol(this.usuario).subscribe(
      (response) => {
        // Verificar si se obtuvo el rol correctamente
        if (response.rol) {
          // Redireccionar según el rol
          if (response.rol === 'usuario') {
            // Si el rol es usuario, redirigir a la página de usuario
            this.router.navigate(['/datos-usuario-itv']);
          } else if (response.rol === 'admin') {
            // Si el rol es admin, redirigir a la página de admin
            this.router.navigate(['/charts']);
          } else {
            // Si el rol no está definido o no es reconocido, mostrar un mensaje de error
            console.error('Rol de usuario no reconocido:', response.rol);
            this.errorMessage = 'Error de rol de usuario';
          }
        } else {
          console.error('Rol de usuario no definido en la respuesta');
        }
      },
      (error) => {
        console.error('Error al obtener el rol del usuario:', error);
      }
    );
  }
  navigateToRegister(): void {
    this.router.navigate(['/register']); // Redirige a la página de registro
  }
}