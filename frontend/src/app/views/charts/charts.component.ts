import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { VehicleService } from '../../vehicle.service';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, ListGroupDirective, ListGroupItemDirective, BadgeComponent, FormDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, ButtonDirective } from '@coreui/angular';


@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, HttpClientModule, RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, ListGroupDirective, ListGroupItemDirective, BadgeComponent, ReactiveFormsModule, FormDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, ButtonDirective
  ]
})
export class ChartsComponent implements OnInit {
  title = 'Vehículos en Inspección';
  vehiculos: any[] = [];

  constructor(
    private vehicleService: VehicleService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.cargarVehiculos();
  }

  // Componente de lista de vehículos
  selectVehicle(vehicle: any) {
    console.log("Navegando a primera fase con vehículo:", vehicle);
    this.vehicleService.changeVehicle(vehicle);
    this.router.navigate(['/inspeccion/primera-fase']).then(result => {
      console.log('Resultado de la navegación:', result);
      if (!result) {
        console.error('La navegación fue bloqueada o no se completó.');
      }
    }).catch(error => {
      console.error('Error durante la navegación:', error);
    });
  }

  cargarVehiculos(): void {
    this.vehicleService.getVehiculos().subscribe({
      next: (data) => {
        console.log(data);  // Verifica los datos recibidos
        this.vehiculos = data;
      },
      error: (error) => {
        console.error('Hubo un error al cargar los vehículos!', error);
      }
    });
  }
}
