import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin-routing.module').then(m => m.routes)
  },
  { path: '', redirectTo: 'admin/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'admin/login' }
];
