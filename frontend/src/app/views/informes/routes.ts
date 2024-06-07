import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./informes.component').then(m => m.InformesComponent),
    data: {
      title: 'Vehículos'
    }
  }
];
