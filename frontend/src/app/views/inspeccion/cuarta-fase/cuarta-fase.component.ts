import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CuartafaseService } from '../../../services/cuartafase.service';

import {
  RowComponent,
  ColComponent,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  ButtonDirective
} from '@coreui/angular';

@Component({
  selector: 'app-cuarta-fase',
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
  templateUrl: './cuarta-fase.component.html',
  styleUrl: './cuarta-fase.component.scss'
})
export class CuartaFaseComponent implements OnInit {
  pruebaForm!: FormGroup;
  grupos = [
    {
      id: 1, nombre: 'Grupo 7: Dirección', subgrupos: ['7.1 Desviación de ruedas', '7.2 Volante y columna de dirección',
      '7.3 Caja de dirección', '7.4 Timonería y rótulas', '7.5 Servodirección']
    },
    {
      id: 2, nombre: 'Grupo 8: Ejes, Ruedas, Neumáticos, Suspensión', subgrupos: ['8.1 Ejes', '8.2 Ruedas', '8.3 Neumáticos', '8.4 Suspensión']
    },
    {
      id: 3, nombre: 'Grupo 9: Motor y Transmisión', subgrupos: ['9.1 Estado general del motor', '9.2 Sistema de alimentación',
      '9.3 Sistema de escape', '9.4 Transmisión', '9.5 Vehículos que utilizan gas como carburante']
    },
    {
      id: 4, nombre: 'Grupo 10: Otros', subgrupos: ['10.1 Transporte de mercancías peligrosas', '10.2 Transporte de mercancías perecederas',
      '10.3 Transporte escolar y de menores', '10.4 Tacógrafo', '10.5 Limitación de velocidad', '10.6 Reformas no autorizadas']
    }
  ];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,  // Inyecta ChangeDetectorRef
    private cuartaFaseService: CuartafaseService
  ) { }

  ngOnInit(): void {
    this.pruebaForm = this.fb.group({
      numerobastidor: ['', Validators.required],
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
      subgrupos: {
        grupo: this.getNombreGrupoPorId(parseInt(this.pruebaForm.get('grupoInspeccion')?.value)),
        subgrupos: formValue.subgrupos.map((sg: any) => ({
          nombre: sg.nombre,
          defecto: sg.defecto
        }))
      }
    };

    console.log('Payload del formulario:', payload);

    this.cuartaFaseService.createCuartafase(payload).subscribe(
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
