import { Routes } from '@angular/router';
// import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'admin/login', pathMatch: 'full' },

  {
    path: 'admin',
    children: [
      // poniżej dobre
      {
        path: 'dish',
        loadComponent: () =>
          import('./admin/components/dish/dish.component').then(m => m.DishPanelComponent)
      },

      // stare wersje doł

      {
        path: 'login',
        loadComponent: () =>
          import('./admin/components/login/login.component').then(m => m.LoginComponent)
      },
      // ekran braku uprawnień
      {
        path: 'unauthorized',
        loadComponent: () =>
          import('./admin/components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
      },
      // sekcja chroniona AdminGuard
      {
        path: '',
        // canActivate: [AdminGuard],
        loadComponent: () =>
          import('./admin/components/admin-home/admin-home.component').then(m => m.AdminHomeComponent),
        children: [
          // restauracje
          {
            path: 'restaurants',
            loadComponent: () =>
              import('./admin/components/restaurant-list/restaurant-list.component').then(m => m.RestaurantListComponent)
          },
          {
            path: 'restaurants/new',
            loadComponent: () =>
              import('./admin/components/restaurant-form/restaurant-form.component').then(m => m.RestaurantFormComponent)
          },
          {
            path: 'restaurants/:id/edit',
            loadComponent: () =>
              import('./admin/components/restaurant-form/restaurant-form.component').then(m => m.RestaurantFormComponent)
          },
          // dania
          // {
          //   path: 'dishes',
          //   loadComponent: () =>
          //     import('./admin/components/dish-list/dish-list.component').then(m => m.DishListComponent)
          // },
          {
            path: 'dishes/new',
            loadComponent: () =>
              import('./admin/components/dish-form/dish-form.component').then(m => m.DishFormComponent)
          },
          {
            path: 'dishes/:id/edit',
            loadComponent: () =>
              import('./admin/components/dish-form/dish-form.component').then(m => m.DishFormComponent)
          },
          // promocje
          {
            path: 'promotions',
            loadComponent: () =>
              import('./admin/components/promotion-list/promotion-list.component').then(m => m.PromotionListComponent)
          },
          {
            path: 'promotions/new',
            loadComponent: () =>
              import('./admin/components/promotion-form/promotion-form.component').then(m => m.PromotionFormComponent)
          },
          {
            path: 'promotions/:id/edit',
            loadComponent: () =>
              import('./admin/components/promotion-form/promotion-form.component').then(m => m.PromotionFormComponent)
          },
          // użytkownicy
          {
            path: 'users',
            loadComponent: () =>
              import('./admin/components/user-list/user-list.component').then(m => m.UserListComponent)
          },
          {
            path: 'users/new',
            loadComponent: () =>
              import('./admin/components/user-form/user-form.component').then(m => m.UserFormComponent)
          },
          {
            path: 'users/:id/edit',
            loadComponent: () =>
              import('./admin/components/user-form/user-form.component').then(m => m.UserFormComponent)
          },
          // zamówienia
          {
            path: 'orders',
            loadComponent: () =>
              import('./admin/components/order-list/order-list.component').then(m => m.OrderListComponent)
          },
          {
            path: 'orders/new',
            loadComponent: () =>
              import('./admin/components/order-form/order-form.component').then(m => m.OrderFormComponent)
          },
          {
            path: 'orders/:id/edit',
            loadComponent: () =>
              import('./admin/components/order-form/order-form.component').then(m => m.OrderFormComponent)
          },
          // przekierowania w ramach /admin
          { path: '', redirectTo: 'restaurants', pathMatch: 'full' },
          { path: '**', redirectTo: '' }
        ]
      }
    ]
  },

  // każdy inny URL → ekran logowania
  { path: '**', redirectTo: 'admin/login' }
];
