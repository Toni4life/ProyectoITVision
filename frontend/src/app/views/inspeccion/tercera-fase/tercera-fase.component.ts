import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TercerafaseService } from '../../../services/tercerafase.service';

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
  selector: 'app-tercera-fase',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ButtonDirective
  ],
  templateUrl: './tercera-fase.component.html',
  styleUrl: './tercera-fase.component.scss'
})
export class TerceraFaseComponent implements OnInit {
  pruebaForm!: FormGroup;
  simulando: boolean = false;
  cuentaAtras: number = 10; // Tiempo en segundos para la cuenta atrás
  frenado: number = 0;
  grupos = [
    {
      id: 1, nombre: 'Grupo 6: Frenos', subgrupos: ['6.1 Freno de servicio', '6.2 Freno secundario',
        '6.3 Freno de estacionamiento', '6.4 Freno de inercia', '6.5 Dispositivo antibloqueo', '6.6 Dispositivo de desaceleración', '6.7 Pedal del dispositivo de frenado',
        '6.8 Bomba de vacío o compresor y depósitos', '6.9 Indicador de baja presión', '6.10 Válvula de regulación del freno de mano', '6.11 Válvulas de frenado', '6.12 Acumulador o depósito de presión',
        '6.13 Acoplamiento de los frenos de remolque', '6.14 Servofreno. Cilindro de mando (sistemas hidráulicos)', '6.15 Tubos rígidos', '6.16 Tubos flexibles', '6.17 Forros', '6.18 Tambores y discos',
        '6.19 Cables, varillas, palancas, conexiones', '6.20 Cilindros del sistema de frenado', '6.21 Válvula sensora de carga', '6.22 Ajustadores de tensión automáticos']
    },
  ];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,  // Inyecta ChangeDetectorRef
    private terceraFaseService: TercerafaseService
  ) { }

  ngOnInit(): void {
    this.pruebaForm = this.fb.group({
      numerobastidor: ['', Validators.required],
      frenos: ['', Validators.required],
      grupoInspeccion: ['', Validators.required],
      subgrupos: this.fb.array([])
    });

    // Asegúrate de que el control existe antes de suscribirte a sus cambios
    const grupoInspeccionControl = this.pruebaForm.get('grupoInspeccion');
    if (grupoInspeccionControl) {
      grupoInspeccionControl.valueChanges.subscribe(groupId => {
        this.updateSubgrupos(groupId);
      });
    }
  }

  iniciarPrueba(): void {
    if (this.pruebaForm.get('frenos')?.value === 'Empty') {
      console.log('Formulario no válido.');
      return; // Asegura que el formulario esté completo
    }

    console.log('Iniciando prueba de frenado...');
    this.simulando = true;
    this.cuentaAtras = 10; // Reinicia la cuenta atrás cada vez que se inicia la prueba
    this.frenado = 0; // Reiniciar el frenado

    const intervalo = setInterval(() => {
      console.log(`Cuenta atrás: ${this.cuentaAtras}, Frenado: ${this.frenado}`);
      if (this.cuentaAtras > 0) {
        this.cuentaAtras--;
        this.frenado += Math.floor(Math.random() * 10 + 1); // Aumenta las emisiones aleatoriamente
      } else {
        clearInterval(intervalo);
        this.simulando = false;
        console.log('Prueba completada. Valor de frenado:', this.frenado);
        alert('Prueba completada. Valor de frenado: ' + this.frenado); // Alerta para mostrar el resultado final
      }
      this.actualizarUI();  // Añade esta línea para asegurar que la UI se actualiza
    }, 1000);
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
    return this.pruebaForm.get('subgrupos') as FormArray;
  }

  actualizarUI(): void {
    this.cdr.detectChanges();  // Forzar la detección de cambios
  }

  onSubmit(): void {
    if (this.pruebaForm.invalid) {
      console.log('Formulario no válido.');
      return; // Asegura que el formulario esté completo
    }

    const formValue = this.pruebaForm.value;

    const payload = {
      numerobastidor: formValue.numerobastidor,
      frenos: formValue.frenos,
      frenado: this.frenado,
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
