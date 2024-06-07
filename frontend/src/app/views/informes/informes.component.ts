import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { VehicleService } from '../../vehicle.service';
import { saveAs } from 'file-saver';
import { ClienteService } from 'src/app/services/cliente.service';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, ListGroupDirective, ListGroupItemDirective, BadgeComponent, FormDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, ButtonDirective } from '@coreui/angular';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.scss'],
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, HttpClientModule, RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, ListGroupDirective, ListGroupItemDirective, BadgeComponent, ReactiveFormsModule, FormDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, ButtonDirective
  ]
})
export class InformesComponent implements OnInit {
  title = 'Informes de Inspección';
  vehiculos: any[] = [];

  constructor(
    private vehicleService: VehicleService,
    private clienteService: ClienteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarVehiculosInformes();
  }

  selectVehicle(vehicle: any) {
    console.log("Navegando a detalle del vehículo:", vehicle);
    this.vehicleService.changeVehicle(vehicle);
    this.router.navigate(['/vehiculo/detalle']).then(result => {
      console.log('Resultado de la navegación:', result);
      if (!result) {
        console.error('La navegación fue bloqueada o no se completó.');
      }
    }).catch(error => {
      console.error('Error durante la navegación:', error);
    });
  }

  cargarVehiculosInformes(): void {
    this.vehicleService.getVehiculosInformes().subscribe({
      next: (data) => {
        console.log(data);  // Verifica los datos recibidos
        this.vehiculos = data;
      },
      error: (error) => {
        console.error('Hubo un error al cargar los vehículos inspeccionados!', error);
      }
    });
  }

  verInspeccion(vehiculo: any): void {
    this.clienteService.generarPDF(vehiculo.numerobastidor).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        saveAs(blob, `inspeccion_${vehiculo.numerobastidor}.pdf`);
      },
      (error) => {
        alert('este vehiculo no tiene una inspección pasada');
        console.error('Error al generar el PDF:', error);
      }
    );
  }
}
