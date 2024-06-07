import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../../../vehicle.service';
import { PrimerafaseService } from '../../../services/primerafase.service';
import { Vehicle } from '../../../services/vehicle.interface';
import {
  RowComponent,
  ColComponent,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  ButtonDirective,
  AlertComponent,
  BadgeComponent
} from '@coreui/angular';
import { HttpClientModule } from '@angular/common/http';
import { IconDirective } from '@coreui/icons-angular';

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
    ButtonDirective,
    AlertComponent,
    IconDirective,
    BadgeComponent
  ]
})
export class PrimeraFaseComponent implements OnInit {
  vehiculoForm!: FormGroup;
  vehicleId: number | null = null;
  showSuccessAlert: boolean = false;
  showErrorAlert: boolean = false;
  faseCompletada: boolean = false;
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

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private primeraFaseService: PrimerafaseService,
    private router: Router,
  ) { }
  public mostrarSubgrupos: boolean = false;

  toggleSubgrupos() {
    this.mostrarSubgrupos = !this.mostrarSubgrupos;
  }

  ngOnInit(): void {
    this.vehiculoForm = this.fb.group({
      numerobastidor: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      combustible: ['', Validators.required],
      normativaeuro: ['', Validators.required],
      aniofabricacion: ['', Validators.required],
      kilometraje: ['', Validators.required],
      fecha: ['', Validators.required],
      subgrupos: this.fb.array(this.initAllSubgrupos())  // Inicializa todos los subgrupos
    });

    this.vehicleService.currentVehicle.subscribe((vehicle: Vehicle) => {
      if (vehicle) {
        this.vehiculoForm.patchValue({
          numerobastidor: vehicle.numerobastidor,
          marca: vehicle.marca,
          modelo: vehicle.modelo,
          combustible: vehicle.combustible,
          normativaeuro: vehicle.normativaeuro,
          aniofabricacion: vehicle.aniofabricacion,
          kilometraje: ''
        });
        this.loadPhaseData(vehicle.numerobastidor); // Cargar datos de la fase
      }
    });
  }

  loadPhaseData(numerobastidor: string): void {
    this.primeraFaseService.getPrimerafase(numerobastidor).subscribe(response => {
      if (response) {
        this.faseCompletada = true;  // Marca la fase como completada si hay datos
        this.vehiculoForm.patchValue({
          kilometraje: response.km,
          fecha: response.fecha,
          subgrupos: response.subgrupos.subgrupos.map((sg: any) => ({
            nombre: sg.nombre,
            defecto: sg.defecto
          }))
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
      this.showErrorAlert = true;
      setTimeout(() => this.showErrorAlert = false, 2000);  // Ocultar alerta después de 2 segundos
      return;
    }

    const formValue = this.vehiculoForm.value;

    const payload = {
      numerobastidor: formValue.numerobastidor,
      fecha: formValue.fecha,
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
        this.showSuccessAlert = true;
        this.faseCompletada = true;  // Marca la fase como completada después de guardar
        setTimeout(() => {
          this.showSuccessAlert = false;
          this.router.navigate(['/inspeccion/segunda-fase'], {
            state: { numeroBastidor: formValue.numerobastidor }
          });
        }, 2000);  // Esperar 2 segundos antes de navegar a la siguiente fase
      },
      (error: any) => {
        console.error('Error guardando los datos:', error);
        this.showErrorAlert = true;
        setTimeout(() => this.showErrorAlert = false, 2000);  // Ocultar alerta después de 2 segundos
      }
    );
  }

  nextPhase(): void {
    if (this.vehiculoForm.invalid) {
      console.log('Formulario no válido.');
      return;
    }

    this.router.navigate(['/inspeccion/segunda-fase'], {
      state: { numeroBastidor: this.vehiculoForm.value.numerobastidor }
    });
  }

  getNombreGrupoPorId(id: number): string {
    const grupo = this.grupos.find(grupo => grupo.id === id);
    return grupo ? grupo.nombre : '';
  }

  // Función para inicializar todos los subgrupos
  initAllSubgrupos(): FormGroup[] {
    let allSubgrupos: FormGroup[] = [];
    this.grupos.forEach(grupo => {
      grupo.subgrupos.forEach(subgrupo => {
        allSubgrupos.push(this.fb.group({
          grupo: [grupo.nombre],  // Agrega el nombre del grupo para referencia
          nombre: [subgrupo],
          defecto: ['', Validators.required]
        }));
      });
    });
    return allSubgrupos;
  }
}
