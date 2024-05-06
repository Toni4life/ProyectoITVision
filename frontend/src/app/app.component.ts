import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { VehicleService } from './vehicle.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule]
})
export class AppComponent {
  title = 'Vehículos Disponibles';
  vehiculos: any[] = [];

  constructor(private vehicleService: VehicleService) {}

  cargarVehiculos(): void {
    this.vehicleService.getVehiculos().subscribe({
      next: (data) => {
        this.vehiculos = data;
      },
      error: (error) => {
        console.error('Hubo un error!', error);
        console.log('Mensaje de error:', error.error);
      }
    });
  }
}
