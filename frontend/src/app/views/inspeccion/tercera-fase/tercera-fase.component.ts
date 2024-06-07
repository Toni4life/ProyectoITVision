import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TercerafaseService } from '../../../services/tercerafase.service';

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
  selector: 'app-tercera-fase',
  standalone: true,
  templateUrl: './tercera-fase.component.html',
  styleUrls: ['./tercera-fase.component.scss'],
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
export class TerceraFaseComponent implements OnInit {
  pruebaForm!: FormGroup;
  simulando: boolean = false;
  cuentaAtras: number = 10; // Tiempo en segundos para la cuenta atrás
  frenado: number = 0;
  frenadoDelantero: number = 0;
  frenadoTrasero: number = 0;
  showSuccessAlert: boolean = false;
  showErrorAlert: boolean = false;
  faseCompletada: boolean = false;
  grupos = [
    {
      id: 1, nombre: 'Grupo 6: Frenos', subgrupos: ['6.1 Freno de servicio', '6.2 Freno secundario',
        '6.3 Freno de estacionamiento', '6.4 Freno de inercia', '6.5 Dispositivo antibloqueo', '6.6 Dispositivo de desaceleración', '6.7 Pedal del dispositivo de frenado',
        '6.8 Bomba de vacío o compresor y depósitos', '6.9 Indicador de baja presión', '6.10 Válvula de regulación del freno de mano', '6.11 Válvulas de frenado', '6.12 Acumulador o depósito de presión',
        '6.13 Acoplamiento de los frenos de remolque', '6.14 Servofreno. Cilindro de mando (sistemas hidráulicos)', '6.15 Tubos rígidos', '6.16 Tubos flexibles', '6.17 Forros', '6.18 Tambores y discos',
        '6.19 Cables, varillas, palancas, conexiones', '6.20 Cilindros del sistema de frenado', '6.21 Válvula sensora de carga', '6.22 Ajustadores de tensión automáticos']
    },
  ];

  public nb: string = "";
  public mostrarSubgrupos: boolean = false;

  constructor(
    private fb: FormBuilder,
    private terceraFaseService: TercerafaseService,
    private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state && navigation.extras.state['numeroBastidor']) {
      this.nb = navigation.extras.state['numeroBastidor'];
    }
  }

  toggleSubgrupos() {
    this.mostrarSubgrupos = !this.mostrarSubgrupos;
  }

  ngOnInit(): void {
    this.pruebaForm = this.fb.group({
      numerobastidor: [this.nb, Validators.required],
      grupoInspeccion: [this.grupos[0].id, Validators.required],
      subgrupos: this.fb.array(this.initAllSubgrupos())  // Inicializa todos los subgrupos
    });

    console.log('Formulario inicializado:', this.pruebaForm);

    // Cargar datos de la fase si ya existen
    this.loadPhaseData(this.nb);

    const grupoInspeccionControl = this.pruebaForm.get('grupoInspeccion');
    if (grupoInspeccionControl) {
      grupoInspeccionControl.valueChanges.subscribe(groupId => {
        this.updateSubgrupos(groupId);
      });
    }
  }

  loadPhaseData(numerobastidor: string): void {
    console.log('Cargando datos de la fase para el número de bastidor:', numerobastidor);
    this.terceraFaseService.getTercerafase(numerobastidor).subscribe(response => {
      console.log('Respuesta recibida del servicio:', response);
      if (response && response.subgrupos && response.subgrupos.subgrupos.length > 0) { // Asegúrate de que hay subgrupos
        console.log('Datos recibidos de la fase:', response);
        this.faseCompletada = true; // Marca la fase como completada si hay datos
        this.pruebaForm.patchValue({
          subgrupos: response.subgrupos.subgrupos.map((sg: any) => ({
            nombre: sg.nombre,
            defecto: sg.defecto
          }))
        });
  
        this.frenadoDelantero = response.freno_delantero;
        this.frenadoTrasero = response.freno_trasero;
  
        const subgruposArray = this.subgrupos;
        subgruposArray.clear();
        if (response.subgrupos && response.subgrupos.subgrupos) {
          response.subgrupos.subgrupos.forEach((sg: any) => {
            subgruposArray.push(this.fb.group({
              nombre: [sg.nombre],
              defecto: [sg.defecto, Validators.required]
            }));
          });
          console.log('Subgrupos cargados:', subgruposArray.value);
        } else {
          console.log('No se encontraron subgrupos en la respuesta.');
        }
      } else {
        this.faseCompletada = false; // No hay datos, no marcar como completada
        console.log('No se encontraron datos para el número de bastidor:', numerobastidor);
      }
    }, error => {
      this.faseCompletada = false; // Error al cargar datos, no marcar como completada
      console.error('Error al cargar los datos de la fase:', error);
    });
  }
  

  iniciarPrueba(): void {
    console.log('Iniciando prueba de frenado...');
    this.simulando = true;
    this.cuentaAtras = 10; // Reinicia la cuenta atrás cada vez que se inicia la prueba
    this.frenadoDelantero = 0; // Reiniciar el frenado delantero
    this.frenadoTrasero = 0; // Reiniciar el frenado trasero

    const intervalo = setInterval(() => {
      console.log(`Cuenta atrás: ${this.cuentaAtras}, Frenado Delantero: ${this.frenadoDelantero}, Frenado Trasero: ${this.frenadoTrasero}`);
      if (this.cuentaAtras > 0) {
        this.cuentaAtras--;
        this.frenadoDelantero += Math.floor(Math.random() * 10 + 1); // Aumenta el frenado delantero aleatoriamente
        this.frenadoTrasero += Math.floor(Math.random() * 10 + 1);  // Aumenta el frenado trasero aleatoriamente
      } else {
        clearInterval(intervalo);
        this.simulando = false;
        console.log('Prueba completada. Valor de frenado delantero:', this.frenadoDelantero);
        console.log('Prueba completada. Valor de frenado trasero:', this.frenadoTrasero);
        alert(`Prueba completada. Valor de frenado delantero: ${this.frenadoDelantero}, Valor de frenado trasero: ${this.frenadoTrasero}`); // Alerta para mostrar el resultado final
      }
    }, 1000);
  }

  updateSubgrupos(groupId: number): void {
    console.log('Actualizando subgrupos para el grupo de inspección:', groupId);
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
    console.log('Subgrupos actualizados:', this.subgrupos.value);
  }

  get subgrupos(): FormArray {
    return this.pruebaForm.get('subgrupos') as FormArray;
  }

  nextPhase(): void {
    console.log('Verificando datos para pasar a la siguiente fase...');
    this.terceraFaseService.getTercerafase(this.pruebaForm.get('numerobastidor')?.value).subscribe(response => {
      if (response) {
        console.log('Datos encontrados. Navegando a la siguiente fase.');
        this.router.navigate(['/inspeccion/cuarta-fase'], {
          state: { numeroBastidor: this.pruebaForm.value.numerobastidor }
        });
      } else {
        console.log('No se encontraron datos en la base de datos.');
        alert('No se encontraron datos en la base de datos.');
      }
    }, error => {
      console.error('Error al verificar los datos:', error);
      alert('Error al verificar los datos.');
    });
  }

  onSubmit(): void {
    if (this.pruebaForm.invalid) {
      console.log('Formulario no válido.');
      this.showErrorAlert = true;
      setTimeout(() => this.showErrorAlert = false, 2000);  // Ocultar alerta después de 2 segundos
      return;
    }

    const formValue = this.pruebaForm.value;

    const payload = {
      numerobastidor: formValue.numerobastidor,
      freno_delantero: this.frenadoDelantero,
      freno_trasero: this.frenadoTrasero,
      subgrupos: {
        grupo: this.getNombreGrupoPorId(parseInt(this.pruebaForm.get('grupoInspeccion')?.value)),
        subgrupos: formValue.subgrupos.map((sg: any) => ({
          nombre: sg.nombre,
          defecto: sg.defecto
        }))
      }
    };

    console.log('Payload del formulario:', payload);

    this.terceraFaseService.createTercerafase(payload).subscribe(
      (response: any) => {
        console.log('Datos guardados:', response);
        this.showSuccessAlert = true;
        this.faseCompletada = true;  // Marca la fase como completada después de guardar
        setTimeout(() => {
          this.showSuccessAlert = false;
          this.nextPhase();  // Navegar a la siguiente fase
        }, 2000);  // Esperar 2 segundos antes de navegar a la siguiente fase
      },
      (error: any) => {
        console.error('Error guardando los datos:', error);
        this.showErrorAlert = true;
        setTimeout(() => this.showErrorAlert = false, 2000);  // Ocultar alerta después de 2 segundos
      }
    );
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
