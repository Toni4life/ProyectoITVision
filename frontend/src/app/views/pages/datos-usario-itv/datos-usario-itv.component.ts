import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from 'src/app/services/login.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';
import { RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, ButtonDirective } from '@coreui/angular';

@Component({
  selector: 'app-datos-usario-itv',
  standalone: true,
  imports: [CommonModule, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, ButtonDirective],
  templateUrl: './datos-usario-itv.component.html',
  styleUrls: ['./datos-usario-itv.component.scss']
})
export class DatosUsuarioITVComponent implements OnInit {
  datosCliente: any;
  vehiculos: any[] = [];
  clienteId: number = 0;
  vehiculosCargados: boolean = false;

  constructor(private clienteService: ClienteService, private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    const usuario = this.loginService.getUsuarioCookie();
    
    if (usuario) {
      this.clienteService.obtenerClienteIdPorUsuario(usuario).subscribe(
        (response) => {
          this.clienteId = response.clienteid;
          this.obtenerDatosCliente();
        },
        (error) => {
          console.error('Error al obtener el clienteId:', error);
        }
      );
    }
  }

  obtenerDatosCliente(): void {
    if (this.clienteId !== undefined) {
      const clienteIdStr = this.clienteId.toString();
      this.clienteService.obtenerDatosCliente(clienteIdStr).subscribe(
        (response) => {
          this.datosCliente = response;
        },
        (error) => {
          console.error('Error al obtener los datos del cliente:', error);
        }
      );
    } else {
      console.error('El clienteId es undefined');
    }
  }

  cargarVehiculos(): void {
    this.vehiculosCargados = !this.vehiculosCargados; // Alternar el valor de la bandera

    if (this.vehiculosCargados && this.clienteId !== 0) {
      this.clienteService.obtenerVehiculosCliente(this.clienteId).subscribe(
        (response) => {
          this.vehiculos = response;
        },
        (error) => {
          console.error('Error al obtener los vehículos del cliente:', error);
        }
      );
    }
  }

  tieneInforme(vehiculo: any): boolean {
    return vehiculo.informeDisponible || true;
  }

  verInspeccion(vehiculo: any): void {
    this.clienteService.generarPDF(vehiculo.numerobastidor).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        saveAs(blob, `inspeccion_${vehiculo.numerobastidor}.pdf`);
      },
      (error) => {
        alert('Este vehículo no tiene una inspección pasada');
        console.error('Error al generar el PDF:', error);
      }
    );
  }

  obtenerFechaFormateada(fecha: string): string {
    const fechaNacimiento = new Date(fecha);
    const fechaLocal = fechaNacimiento.toLocaleDateString();
    return fechaLocal;
  }

  cerrarSesion(): void {
    this.router.navigate(['/login']);
  }
}
