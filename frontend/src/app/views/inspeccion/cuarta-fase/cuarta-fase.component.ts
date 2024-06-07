import { Router, ActivatedRoute } from '@angular/router';
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
  ButtonDirective,
  AlertComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';

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
    ButtonDirective,
    AlertComponent,
    IconDirective
  ],
  templateUrl: './cuarta-fase.component.html',
  styleUrls: ['./cuarta-fase.component.scss']
})
export class CuartaFaseComponent implements OnInit {
  pruebaForm!: FormGroup;
  showSuccessAlert: boolean = false;
  showErrorAlert: boolean = false;
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

  public nb: string = "";
  public mostrarSubgrupos: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,  // Inyecta ChangeDetectorRef
    private cuartaFaseService: CuartafaseService,
    private router: Router,
    private route: ActivatedRoute) {
      const navigation = this.router.getCurrentNavigation();
      console.log(navigation);
      if (navigation && navigation.extras && navigation.extras.state && navigation.extras.state['numeroBastidor']) {
        this.nb = navigation.extras.state['numeroBastidor'];
        console.log(this.nb);
      }
    }

  toggleSubgrupos() {
    this.mostrarSubgrupos = !this.mostrarSubgrupos;
  }

  ngOnInit(): void {
    this.pruebaForm = this.fb.group({
      numerobastidor: ['', Validators.required],
      subgrupos: this.fb.array(this.initAllSubgrupos())
    });

    this.pruebaForm.patchValue({
      numerobastidor: this.nb
    });

    this.loadPhaseData(this.nb); // Cargar datos de la fase
  }

  loadPhaseData(numerobastidor: string): void {
    this.cuartaFaseService.getCuartafase(numerobastidor).subscribe(response => {
      if (response) {
        this.pruebaForm.setControl('subgrupos', this.fb.array(response.subgrupos.subgrupos.map((sg: any) => {
          return this.fb.group({
            grupo: sg.grupo,
            nombre: sg.nombre,
            defecto: [sg.defecto, Validators.required]
          });
        })));
      }
    });
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
      this.showErrorAlert = true;
      setTimeout(() => this.showErrorAlert = false, 3000);  // Ocultar alerta después de 3 segundos
      return;
    }

    const formValue = this.pruebaForm.value;

    const payload = {
      numerobastidor: formValue.numerobastidor,
      subgrupos: {
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
        this.showSuccessAlert = true;
        setTimeout(() => {
          this.showSuccessAlert = false;
          this.router.navigate(['/charts']);
        }, 3000);  // Esperar 3 segundos antes de navegar a la siguiente fase
      },
      (error: any) => {
        console.error('Error guardando los datos:', error);
        this.showErrorAlert = true;
        setTimeout(() => this.showErrorAlert = false, 3000);  // Ocultar alerta después de 3 segundos
      }
    );
  }

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
