import { Routes } from '@angular/router';

export const routes: Routes = [
  // 1) Gdy ktoś wejdzie na „/”, od razu przekierowujemy do „/login”
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 2) Ekran logowania: dostępny pod „/login”
  {
    path: 'login',
    loadComponent: () =>
      import('./admin/components/login/login.component').then(m => m.LoginComponent)
  },

  // 3) Panel dań: dostępny pod „/dish”
  {
    path: 'dish',
    loadComponent: () =>
      import('./admin/components/dish/dish.component').then(m => m.DishPanelComponent)
  },

  // 4) Ekran „brak uprawnień”: dostępny pod „/unauthorized”
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./admin/components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },

  {
    path: 'orders',
    loadComponent: () =>
      import('./admin/components/order/order.component').then(m => m.OrdersComponent)
  },

  // 5) Jeśli ktoś wpisze dowolną nieobsługiwaną ścieżkę → przekieruj na /login
  { path: '**', redirectTo: 'login' }
];
