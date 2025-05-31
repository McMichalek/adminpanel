import { Routes } from '@angular/router';
import { AdminGuard } from './admin/guards/admin.guard';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },


  {
    path: 'login',
    loadComponent: () =>
      import('./admin/components/login/login.component').then(m => m.LoginComponent)
  },


  {
    path: 'dish',
    loadComponent: () =>
      import('./admin/components/dish/dish.component').then(m => m.DishPanelComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./admin/components/order/order.component').then(m => m.OrdersComponent),
    canActivate: [AdminGuard]
  },

  {
    path: 'opinions',
    loadComponent: () =>
      import('./admin/components/opinion/opinion.component').then(m => m.OpinionsComponent),
    canActivate: [AdminGuard]
  },


  {
    path: 'restaurants',
    loadComponent: () =>
      import('./admin/components/restaurant/restaurant.component').then(m => m.RestaurantsComponent),
    canActivate: [AdminGuard]
  },

  {
    path: 'special-offers',
    loadComponent: () =>
      import('./admin/components/special-offer/special-offer.component').then(m => m.SpecialOffersComponent),
    canActivate: [AdminGuard]
  },


  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./admin/components/unauthorized/unauthorized.component').then(
        m => m.UnauthorizedComponent
      )
  },

  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
