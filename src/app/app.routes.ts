import { Routes } from '@angular/router';
// import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  // 1) Jeśli ktoś wejdzie na „/”, od razu robimy redirect na „/login”
  { path: '', redirectTo: 'dish', pathMatch: 'full' },

  // 2) Ścieżka do logowania (poziom root, bez „admin”!)
  {
    path: 'login',
    loadComponent: () =>
      import('./admin/components/login/login.component').then(m => m.LoginComponent)
  },

  // 3) Ścieżki zaczynające się od „/admin” – tutaj (np.) panel dań, ekran braku uprawnień itp.
  {
    path: 'admin',
    // ewentualnie dodaj tu AdminGuard w canActivate, jeśli potrzebujesz
    // canActivate: [AdminGuard],
    children: [
      {
        path: 'dish',
        loadComponent: () =>
          import('./admin/components/dish/dish.component').then(m => m.DishPanelComponent)
      },
      {
        path: 'unauthorized',
        loadComponent: () =>
          import('./admin/components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
      },
      // Jeśli ktoś wpisze /admin/cokolwiek-innego niż powyższe, przekieruj na /admin/unauthorized
      { path: '**', redirectTo: 'unauthorized' }
    ]
  },

  // 4) Gdy ktoś wpisze nieistniejącą trasę (np. /foo, /bar), wyrzucamy do /login
  { path: '**', redirectTo: 'dish' }
];
