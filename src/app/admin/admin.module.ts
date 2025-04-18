import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { RestaurantListComponent } from './components/restaurant-list/restaurant-list.component';
import { RestaurantFormComponent } from './components/restaurant-form/restaurant-form.component';
import { DishListComponent } from './components/dish-list/dish-list.component';
import { DishFormComponent } from './components/dish-form/dish-form.component';
import { PromotionListComponent } from './components/promotion-list/promotion-list.component';
import { PromotionFormComponent } from './components/promotion-form/promotion-form.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { StockListComponent } from './components/stock-list/stock-list.component';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { StockFormComponent } from './components/stock-form/stock-form.component';


@NgModule({
  declarations: [
    RestaurantListComponent,
    RestaurantFormComponent,
    DishListComponent,
    DishFormComponent,
    PromotionListComponent,
    PromotionFormComponent,
    UserListComponent,
    UserFormComponent,
    OrderListComponent,
    StockListComponent,
    OrderFormComponent,
    StockFormComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
