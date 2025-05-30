import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdminService } from '../../services/admin.service';
import { Order } from '../../../models/order.model';
import { Dish } from '../../../models/dish.model';
import { User } from '../../../models/user.model';
import {CommonModule, CurrencyPipe} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CurrencyPipe,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders$!: Observable<(Order & { userName: string, dishNames: string[] })[]>;

constructor(private admin: AdminService) {}

ngOnInit() {
  this.orders$ = combineLatest([
    this.admin.getOrders(),
    this.admin.getUsers(),
    this.admin.getDishes()
  ]).pipe(
    map(([orders, users, dishes]) => orders.map(o => ({
      ...o,
      userName: users.find(u => u.id === o.user_id)?.email || 'Nieznany',
      dishNames: Object.entries(o.order_items)
        .map(([dishId, qty]) => {
          const dish = dishes.find(d => d.id === dishId);
          return dish ? `${dish.name} × ${qty}` : '';
        })
        .filter(Boolean)
          })))
  );
}

delete(id: string): void {
  this.admin.deleteOrder(id);
}
}
