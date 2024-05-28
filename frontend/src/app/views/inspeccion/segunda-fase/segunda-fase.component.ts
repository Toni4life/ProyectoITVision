import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SegundafaseService } from '../../../services/segundafase.service';

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
  selector: 'app-segunda-fase',
  templateUrl: './segunda-fase.component.html',
  styleUrls: ['./segunda-fase.component.scss'],
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
export class SegundaFaseComponent implements OnInit {
  pruebaForm!: FormGroup;
  simulando: boolean = false;
  cuentaAtras: number = 10; // Tiempo en segundos para la cuenta atrás
  emisiones: number = 0;
  grupos = [
    { id: 1, nombre: 'Grupo 5: Emisiones Contaminantes', subgrupos: ['5.1 Ruido', '5.2 Vehículos con motor de encendido por chispa',
     '5.3 Vehículos con motor de encendido por compresión', '5.4 Recopilación de datos OBFCM'] },
  ];
  http: any;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef ,
    private segundaFaseService: SegundafaseService // Inyecta ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.pruebaForm = this.fb.group({
      numerobastidor: ['', Validators.required],
      combustible: ['', Validators.required],
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
    if (this.pruebaForm.get('combustible')?.value === 'Empty') {
      console.log('Formulario no válido.');
      return; // Asegura que el formulario esté completo
    }
  
    console.log('Iniciando prueba de emisiones...');
    this.simulando = true;
    this.cuentaAtras = 10; // Reinicia la cuenta atrás cada vez que se inicia la prueba
    this.emisiones = 0; // Reiniciar las emisiones
  
    const intervalo = setInterval(() => {
      console.log(`Cuenta atrás: ${this.cuentaAtras}, Emisiones: ${this.emisiones}`);
      if (this.cuentaAtras > 0) {
        this.cuentaAtras--;
        this.emisiones += Math.floor(Math.random() * 10 + 1); // Aumenta las emisiones aleatoriamente
      } else {
        clearInterval(intervalo);
        this.simulando = false;
        console.log('Prueba completada. Valor de emisiones:', this.emisiones);
        alert('Prueba completada. Valor de emisiones: ' + this.emisiones); // Alerta para mostrar el resultado final
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
      combustible: formValue.combustible,
      emisiones: this.emisiones,
      subgrupos: {
        grupo: this.getNombreGrupoPorId(parseInt(this.pruebaForm.get('grupoInspeccion')?.value)),
        subgrupos: formValue.subgrupos.map((sg: any) => ({
          nombre: sg.nombre,
          defecto: sg.defecto
        }))
      }
    };

    console.log('Payload del formulario:', payload);

    this.segundaFaseService.createSegundafase(payload).subscribe(
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
