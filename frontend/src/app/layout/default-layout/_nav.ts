import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Inicio',
    title: true
  },
  {
    name: 'Vehículos',
    iconComponent: { name: 'cil-car-Alt' },
    url: '/charts'
  },
  {
    name: 'Inspección',
    iconComponent: { name: 'cil-clipboard' },
    url: '/inspeccion',
    children: [
      {
        name: '1ª Fase',
        url: '/inspeccion/primera-fase',
        icon: 'nav-icon-bullet'
      },
      {
        name: '2ª Fase',
        url: '/inspeccion/segunda-fase',
        icon: 'nav-icon-bullet'
      },
      {
        name: '3ª Fase',
        url: '/inspeccion/tercera-fase',
        icon: 'nav-icon-bullet'
      },
      {
        name: '4ª Fase',
        url: '/inspeccion/cuarta-fase',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Informes',
    url: '/informes',
    iconComponent: { name: 'cil-bell' },
  }
];

export const userNavItems: INavData[] = [
  {
    name: 'Inicio',
    title: true
  },
  {
    name: 'Mis Datos',
    url: '/datos-usuario-itv',
    iconComponent: { name: 'cil-bell' },
  },
  {
    title: true,
    name: 'Extras'
  },
  {
    name: 'Pages',
    url: '/login',
    iconComponent: { name: 'cil-star' },
    children: [
      {
        name: 'Login',
        url: '/login',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Register',
        url: '/register',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Error 404',
        url: '/404',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Error 500',
        url: '/500',
        icon: 'nav-icon-bullet'
      }
    ]
  }
];
