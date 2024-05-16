import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Botones'
    },
    children: [
      {
        path: '',
        redirectTo: 'buttons',
        pathMatch: 'full'
      },
      {
        path: 'buttons',
        loadComponent: () => import('./buttons/buttons.component').then(m => m.ButtonsComponent),
        data: {
          title: 'Botones'
        }
      },
      {
        path: 'button-groups',
        loadComponent: () => import('./button-groups/button-groups.component').then(m => m.ButtonGroupsComponent),
        data: {
          title: 'Button groups'
        }
      },
      {
        path: 'dropdowns',
        loadComponent: () => import('./dropdowns/dropdowns.component').then(m => m.DropdownsComponent),
        data: {
          title: 'Dropdowns'
        }
      },
    ]
  }
];

