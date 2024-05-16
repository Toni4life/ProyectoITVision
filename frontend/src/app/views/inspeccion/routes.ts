import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Inspeccion'
    },
    children: [
      {
        path: '',
        redirectTo: 'inspeccion',
        pathMatch: 'full'
      },
      {
        path: 'primera-fase',
        loadComponent: () => import('./primera-fase/primera-fase.component').then(m => m.PrimeraFaseComponent),
        data: {
          title: '1ª Fase'
        }
      },
      {
        path: 'segunda-fase',
        loadComponent: () => import('./segunda-fase/segunda-fase.component').then(m => m.SegundaFaseComponent),
        data: {
          title: '2ª Fase'
        }
      },
      {
        path: 'tercera-fase',
        loadComponent: () => import('./tercera-fase/tercera-fase.component').then(m => m.TerceraFaseComponent),
        data: {
          title: '3ª Fase'
        }
      },
      {
        path: 'cuarta-fase',
        loadComponent: () => import('./cuarta-fase/cuarta-fase.component').then(m => m.CuartaFaseComponent),
        data: {
          title: '4ª Fase'
        }
      },
      {
        path: 'final-fase',
        loadComponent: () => import('./final-fase/final-fase.component').then(m => m.FinalFaseComponent),
        data: {
          title: 'Fase Final'
        }
      }
    ]
  }
];

