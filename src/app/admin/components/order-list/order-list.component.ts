import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { Order } from '../../../models/order.model';
import {RouterLink, RouterModule} from '@angular/router';
import {CommonModule, CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-order-list',
  standalone: true,

  imports: [CommonModule, RouterModule,RouterLink,CurrencyPipe],
  templateUrl: './order-list.component.html'
})
export class OrderListComponent implements OnInit {
  orders$!: Observable<Order[]>;

  constructor(private admin: AdminService) {}

  ngOnInit(): void {
    this.orders$ = this.admin.getOrders();
  }

  delete(id: number): void {
    this.admin.deleteOrder(id);
  }
}
