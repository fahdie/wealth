import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'accounts',
    pathMatch: 'full',
  },
  {
    path: 'accounts/create',
    loadComponent: () =>
      import('./features/accounts/create-account/create-account').then(m => m.CreateAccount),
  },
  {
    path: 'accounts',
    loadComponent: () =>
      import('./features/accounts/AccountComponent').then(m => m.AccountComponent),
  },
];
