import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { FormsModule, NgForm } from '@angular/forms';
import { RegistroService } from '../../../services/registro.service';
import { Router } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: true,
    imports: [ContainerComponent, CommonModule, FormsModule, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective]
})
export class RegisterComponent {
  usuario: string = '';
  nombre: string = '';
  apellidos: string = '';
  fechaNacimiento: string = '';
  dni: string = '';
  telefono: string = '';
  direccion: string = '';
  email: string = '';
  contrasenia: string = '';
  repetirContrasenia: string = '';

  constructor(private registroService: RegistroService, private router: Router) {}

  allFieldsFilled(): boolean {
    return this.usuario.trim() !== '' && this.nombre.trim() !== '' && this.apellidos.trim() !== '' && 
           this.fechaNacimiento.trim() !== '' && this.dni.trim() !== '' && 
           this.telefono.trim() !== '' && this.direccion.trim() !== '' && 
           this.email.trim() !== '' && this.contrasenia.trim() !== '' && 
           this.repetirContrasenia.trim() !== '';
  }

  validDNI(dni: string): boolean {
    const dniPattern = /^[0-9]{8}[A-Z]$/;
    return dniPattern.test(dni);
  }

  validNombreApellido(valor: string): boolean {
    const nombreApellidoPattern = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/;
    return nombreApellidoPattern.test(valor);
  }
  
  validTelefono(telefono: string): boolean {
    const telefonoPattern = /^[679][0-9]{8}$/;
    return telefonoPattern.test(telefono);
  }

  validFechaNacimiento(fechaNacimiento: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return fechaNacimiento <= today;
  }

  validEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  onSubmit(registerForm: NgForm): void {
    if (!this.allFieldsFilled()) {
      alert('Todos los campos deben estar llenos');
      return;
    }

    if (!this.validDNI(this.dni)) {
      alert('El DNI debe tener 8 números seguidos de una letra mayúscula');
      return;
    }

    if (!this.validTelefono(this.telefono)) {
      alert('El teléfono debe tener 9 dígitos y comenzar con 6 o 7');
      return;
    }
    
    if (!this.validNombreApellido(this.nombre)) {
      alert('El nombre solo puede contener letras y espacios');
      return;
    }

    if (!this.validNombreApellido(this.apellidos)) {
      alert('Los apellidos solo pueden contener letras y espacios');
      return;
    }

    if (!this.validFechaNacimiento(this.fechaNacimiento)) {
      alert('La fecha de nacimiento no puede ser posterior a la fecha actual');
      return;
    }

    if (!this.validEmail(this.email)) {
      alert('Por favor, introduce un correo electrónico válido');
      return;
    }

    if (this.contrasenia !== this.repetirContrasenia) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // Proceso de registro
    this.registroService.clientes(this.telefono, this.dni, this.email).pipe(
      catchError(error => {
        console.error('Error en el servidor:', error);
        alert('Error en el servidor');
        return of({ success: false });
      }),
      switchMap(clienteResponse => {
        if (clienteResponse.success === false) {
          alert(clienteResponse.message);
          return of({ success: false });
        } else {
          return this.registroService.insertarCliente(this.nombre, this.apellidos, this.fechaNacimiento, this.telefono, this.dni, this.direccion, this.email);
        }
      }),
      switchMap(clienteInsertResponse => {
        if (clienteInsertResponse.success === false) {
          alert(clienteInsertResponse.message);
          return of({ success: false });
        } else {
          const clienteid = clienteInsertResponse.clienteid; // Obtener el clienteid
          return this.registroService.insertarLogin(this.usuario, this.contrasenia, clienteid);
        }
      })
    ).subscribe(loginInsertResponse => {
      if (loginInsertResponse.success === false) {
        alert(loginInsertResponse.message);
      } else {
        alert('Registro exitoso');
        this.router.navigate(['/login']);
      }
    });
  }
}
