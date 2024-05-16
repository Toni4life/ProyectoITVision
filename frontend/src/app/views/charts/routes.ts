import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./charts.component').then(m => m.ChartsComponent),
    data: {
      title: 'Vehículos'
    }
  },
  {
    path: 'inspeccion/primera-fase', 
    loadComponent: () => import('../inspeccion/primera-fase/primera-fase.component').then(m => m.PrimeraFaseComponent),
    data: {
      title: '1ª Fase'
    }
  }
];
