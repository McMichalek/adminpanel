// src/app/services/order.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderStatus } from '../models/order.model';

interface TransitionOrderStatusPayload {
  id: string;
  status: OrderStatus;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  // Adres bazowy do Waszego FastAPI – dostosujcie, jeżeli różni się host/port
  private baseUrl = 'http://localhost:80/order/worker_panel';

  constructor(private http: HttpClient) {}

  /**
   * Pobiera wszystkie zamówienia o danym statusie.
   * backend odpowiada na GET /order/worker_panel/{order_status}/all
   */
  getOrdersByStatus(status: OrderStatus): Observable<Order[]> {
    const url = `${this.baseUrl}/${status}/all`;
    return this.http.get<Order[]>(url);
  }

  /**
   * Zmienia status zamówienia.
   * backend oczekuje POST /order/worker_panel/transition_status z ciałem { id, status }
   */
  transitionOrderStatus(
    orderId: string,
    newStatus: OrderStatus
  ): Observable<Order> {
    const url = `${this.baseUrl}/transition_status`;
    const payload: TransitionOrderStatusPayload = {
      id: orderId,
      status: newStatus,
    };
    return this.http.post<Order>(url, payload);
  }
}
