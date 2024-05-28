import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../../../services/vehicle.service';
import { PrimerafaseService } from '../../../services/primerafase.service';
import { Vehicle } from '../../../interfaces/vehicle.interface';
import {
  RowComponent,
  ColComponent,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  ButtonDirective
} from '@coreui/angular';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-primera-fase',
  templateUrl: './primera-fase.component.html',
  styleUrls: ['./primera-fase.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ButtonDirective
  ]
})
export class PrimeraFaseComponent implements OnInit {
  vehiculoForm!: FormGroup;
  vehicleId: number | null = null;
  grupos = [
    { id: 1, nombre: 'Grupo 1: Identificación', subgrupos: ['1.1 Documentación', '1.2 Número de Bastidor', '1.3 Placa de Matrícula'] },
    {
      id: 2, nombre: 'Grupo 2: Acondicionamiento exterior, carrocería y chasis', subgrupos: ['2.1 Antiempotramiento delantero',
        '2.2 Carrocería y chasis', '2.3 Dispositivos de acoplamiento', '2.4 Guardabarros y dispositivos antiproyección', '2.5 Limpia y lava parabrisas',
        '2.6 Protecciones laterales', '2.7 Protección trasera', '2.8 Puertas y peldaños', '2.9 Retrovisores', '2.10 Señales en los vehículos',
        '2.11 Soporte exterior de la rueda de repuesto', '2.12 Vidrios de seguridad']
    },
    {
      id: 3, nombre: 'Grupo 3: Acondicionamiento Interior', subgrupos: ['3.1 Asientos y sus anclajes', '3.2 Cinturones de seguridad',
        '3.3 Dispositivo de retención para niños', '3.4 Antihielo y antivaho', '3.5 Antirrobo y alarma', '3.6 Campo de visión directa',
        '3.7 Dispositivos de retención de carga', '3.8 Indicador de velocidad y cuentakilómetros', '3.9 Salientes interiores']
    },
    {
      id: 4, nombre: 'Grupo 4: Alumbrado y señalización', subgrupos: ['4.1 Luces de cruce y carretera', '4.2 Luz de marcha atrás',
        '4.3 Luces indicadoras de dirección', '4.4 Señal de emergencia', '4.5 Luces de frenado', '4.6 Luz de placa de matrícula trasera',
        '4.7 Luces de posición', '4.8 Luces antiniebla', '4.9 Luz de gálibo', '4.10 Catadióptricos', '4.11 Alumbrado interior',
        '4.12 Avisador acústico', '4.13 Luz de estacionamiento', '4.14 Señalización de apertura de puertas', '4.15 Señalización luminosa específica',
        '4.16 Luces de circulación diurna']
    }
  ];
subgruposControls: any;

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private primeraFaseService: PrimerafaseService  ) { }

  ngOnInit(): void {
    this.vehiculoForm = this.fb.group({
      numerobastidor: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      combustible: ['', Validators.required],
      normativaeuro: ['', Validators.required],
      aniofabricacion: ['', Validators.required],
      kilometraje: ['', Validators.required],
      grupoInspeccion: ['', Validators.required],
      subgrupos: this.fb.array([])
    });

    // Asegúrate de que el control existe antes de suscribirte a sus cambios
    const grupoInspeccionControl = this.vehiculoForm.get('grupoInspeccion');
    if (grupoInspeccionControl) {
      grupoInspeccionControl.valueChanges.subscribe(groupId => {
        this.updateSubgrupos(groupId);
      });
    }

    this.vehicleService.currentVehicle.subscribe((vehicle: Vehicle) => {
      if (vehicle) {
        this.vehiculoForm.patchValue({
          numerobastidor: vehicle.numerobastidor,
          marca: vehicle.marca,
          modelo: vehicle.modelo,
          combustible: vehicle.combustible,
          normativaeuro: vehicle.normativaeuro,
          aniofabricacion: vehicle.aniofabricacion,
          kilometraje: ''  // El kilometraje se deja en blanco para nueva entrada
        });
      }
    });
  }

  updateSubgrupos(groupId: number): void {
    const subgruposArray = this.subgrupos;
    subgruposArray.clear(); // Limpia los subgrupos existentes
    const selectedGroup = this.grupos.find(g => g.id === Number(groupId));
    if (selectedGroup) {
      selectedGroup.subgrupos.forEach(subgrupo => {
        subgruposArray.push(this.fb.group({
          nombre: [subgrupo], // Nombre del subgrupo
          defecto: ['', Validators.required] // Control para seleccionar el tipo de defecto
        }));
      });
    }
  }

  get subgrupos(): FormArray {
    return this.vehiculoForm.get('subgrupos') as FormArray;
  }

  onSubmit(): void {
    if (this.vehiculoForm.invalid) {
      console.log('Formulario no válido.');
      return;
    }
  
    const formValue = this.vehiculoForm.value;
  
    const payload = {
      numerobastidor: formValue.numerobastidor,
      km: formValue.kilometraje,
      subgrupos: {
        grupo: this.getNombreGrupoPorId(parseInt(this.vehiculoForm.get('grupoInspeccion')?.value)),
        subgrupos: formValue.subgrupos.map((sg: any) => ({
          nombre: sg.nombre,
          defecto: sg.defecto
        }))
      }
    };

    console.log('Payload:', payload);
  
    this.primeraFaseService.createPrimerafase(payload).subscribe(
      (response: any) => {
        console.log('Datos guardados:', response);
      },
      (error: any) => {
        console.error('Error guardando los datos:', error);
      }
    );
  }

  getNombreGrupoPorId(id: number): string {
    const grupo = this.grupos.find(grupo => grupo.id === id);
    return grupo ? grupo.nombre : '';
  }
}
