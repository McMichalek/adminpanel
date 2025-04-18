import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RestaurantListComponent } from './components/restaurant-list/restaurant-list.component';
import { RestaurantFormComponent } from './components/restaurant-form/restaurant-form.component';
import { DishListComponent } from './components/dish-list/dish-list.component';
import { DishFormComponent } from './components/dish-form/dish-form.component';
import { PromotionListComponent } from './components/promotion-list/promotion-list.component';
import { PromotionFormComponent } from './components/promotion-form/promotion-form.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { StockListComponent } from './components/stock-list/stock-list.component';
import { StockFormComponent } from './components/stock-form/stock-form.component';

const routes: Routes = [
  { path: 'restaurants', component: RestaurantListComponent },
  { path: 'restaurants/new', component: RestaurantFormComponent },
  { path: 'restaurants/:id/edit', component: RestaurantFormComponent },
  { path: 'dishes', component: DishListComponent },
  { path: 'dishes/new', component: DishFormComponent },
  { path: 'dishes/:id/edit', component: DishFormComponent },
  { path: 'promotions', component: PromotionListComponent },
  { path: 'promotions/new', component: PromotionFormComponent },
  { path: 'promotions/:id/edit', component: PromotionFormComponent },
  { path: 'users', component: UserListComponent },
  { path: 'users/new', component: UserFormComponent },
  { path: 'users/:id/edit', component: UserFormComponent },
  { path: 'orders', component: OrderListComponent },
  { path: 'orders/new', component: OrderFormComponent },
  { path: 'orders/:id/edit', component: OrderFormComponent },
  { path: 'stock', component: StockListComponent },
  { path: 'stock/new', component: StockFormComponent },
  { path: 'stock/:id/edit', component: StockFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
