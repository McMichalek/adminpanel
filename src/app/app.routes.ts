import { Routes } from '@angular/router';
import { AdminGuard } from './admin/guards/admin.guard';
import {AdminDashboardComponent} from './admin/components/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./admin/components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    component: AdminDashboardComponent, // bo standalone: true, możemy użyć „component”
    canActivate: [AdminGuard]
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
      import('./admin/components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent
      )
  },

  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
