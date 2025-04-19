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
  templateUrl: './order-list.component.html'
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
        userName: users.find(u => u.id === o.userId)?.name || 'Nieznany',
        dishNames: dishes.filter(d => o.dishIds.includes(d.id)).map(d => d.name)
      })))
    );
  }

  delete(id: number): void {
    this.admin.deleteOrder(id);
  }
}
