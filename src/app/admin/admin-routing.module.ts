import { Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: '',
    canActivate: [AdminGuard],
    loadComponent: () =>
      import('./components/admin-home/admin-home.component').then(m => m.AdminHomeComponent),
    children: [
      {
        path: 'restaurants',
        loadComponent: () =>
          import('./components/restaurant-list/restaurant-list.component').then(m => m.RestaurantListComponent)
      },
      {
        path: 'restaurants/new',
        loadComponent: () =>
          import('./components/restaurant-form/restaurant-form.component').then(m => m.RestaurantFormComponent)
      },
      {
        path: 'restaurants/:id/edit',
        loadComponent: () =>
          import('./components/restaurant-form/restaurant-form.component').then(m => m.RestaurantFormComponent)
      },
      {
        path: 'dishes',
        loadComponent: () =>
          import('./components/dish-list/dish-list.component').then(m => m.DishListComponent)
      },
      {
        path: 'dishes/new',
        loadComponent: () =>
          import('./components/dish-form/dish-form.component').then(m => m.DishFormComponent)
      },
      {
        path: 'dishes/:id/edit',
        loadComponent: () =>
          import('./components/dish-form/dish-form.component').then(m => m.DishFormComponent)
      },
      {
        path: 'promotions',
        loadComponent: () =>
          import('./components/promotion-list/promotion-list.component').then(m => m.PromotionListComponent)
      },
      {
        path: 'promotions/new',
        loadComponent: () =>
          import('./components/promotion-form/promotion-form.component').then(m => m.PromotionFormComponent)
      },
      {
        path: 'promotions/:id/edit',
        loadComponent: () =>
          import('./components/promotion-form/promotion-form.component').then(m => m.PromotionFormComponent)
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./components/user-list/user-list.component').then(m => m.UserListComponent)
      },
      {
        path: 'users/new',
        loadComponent: () =>
          import('./components/user-form/user-form.component').then(m => m.UserFormComponent)
      },
      {
        path: 'users/:id/edit',
        loadComponent: () =>
          import('./components/user-form/user-form.component').then(m => m.UserFormComponent)
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./components/order-list/order-list.component').then(m => m.OrderListComponent)
      },
      {
        path: 'orders/new',
        loadComponent: () =>
          import('./components/order-form/order-form.component').then(m => m.OrderFormComponent)
      },
      {
        path: 'orders/:id/edit',
        loadComponent: () =>
          import('./components/order-form/order-form.component').then(m => m.OrderFormComponent)
      },
      {
        path: '',
        redirectTo: 'restaurants',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  }
];
