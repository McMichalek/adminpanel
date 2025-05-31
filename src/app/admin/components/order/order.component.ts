// src/app/components/orders/orders.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Order, OrderStatus } from '../../models/order.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Panel Zamówień (Worker Panel)</h2>

      <!-- Wybór statusu do filtrowania -->
      <div class="form-group">
        <label for="statusSelect">Wybierz status zamówień:</label>
        <select
          id="statusSelect"
          class="form-control"
          [(ngModel)]="selectedStatus"
          (change)="loadOrders()"
        >
          <option *ngFor="let s of statuses" [value]="s">{{ s }}</option>
        </select>
      </div>

      <button class="btn btn-primary mt-2" (click)="loadOrders()">
        Załaduj zamówienia
      </button>

      <hr />

      <!-- Jeśli żadnych zamówień nie ma -->
      <div *ngIf="orders.length === 0">
        <p>Brak zamówień o statusie <strong>{{ selectedStatus }}</strong>.</p>
      </div>

      <!-- Tabela zamówień -->
      <table
        *ngIf="orders.length > 0"
        class="table table-bordered table-hover mt-3"
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>restaurant_id</th>
            <th>Status</th>
            <!-- dodaj tu inne nagłówki, jak data, pozycje, suma, itp. -->
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let o of orders">
            <td>{{ o.id }}</td>
            <td>{{ o.restaurant_id }}</td>
            <td>{{ o.status }}</td>
            <!-- tutaj inne pola, np. <td>{{ o.total_price }}</td> itd. -->
            <td>
              <!-- Przykład: przycisk do zmiany statusu na kolejny krok -->
              <button
                class="btn btn-sm btn-success"
                [disabled]="o.status === OrderStatus.READY"
                (click)="onTransition(o)"
              >
                {{ getNextStatusLabel(o.status) }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Ewentualnie komunikat o błędzie lub loading -->
      <div *ngIf="loading">Ładowanie...</div>
      <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 800px;
        margin: 20px auto;
      }
    `,
  ],
})
export class OrdersComponent implements OnInit {
  public statuses = Object.values(OrderStatus);
  public selectedStatus: OrderStatus = OrderStatus.PAID;

  public orders: Order[] = [];
  public loading = false;
  public error: string | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.error = null;
    this.loading = true;
    this.orders = [];

    this.orderService.getOrdersByStatus(this.selectedStatus).subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Błąd podczas pobierania zamówień.';
        console.error(err);
        this.loading = false;
      },
    });
  }

  /**
   * Zwraca tekst przycisku w zależności od bieżącego statusu:
   * np. jeśli status PAID → przycisk: "Przejdź do IN_PROGRESS"
   */
  getNextStatusLabel(current: OrderStatus): string {
    switch (current) {
      case OrderStatus.PAID:
        return 'Przejdź do IN_PROGRESS';
      case OrderStatus.IN_PROGRESS:
        return 'Przejdź do READY';
      case OrderStatus.READY:
        return 'Gotowe'; // przycisk nieaktywny (?)
      default:
        return 'Zaktualizuj';
    }
  }

  /**
   * Obsługa przejścia na kolejny status.
   * Po poprawnym update-ie odświeżamy listę.
   */
  onTransition(order: Order): void {
    let nextStatus: OrderStatus;
    switch (order.status) {
      case OrderStatus.PAID:
        nextStatus = OrderStatus.IN_PROGRESS;
        break;
      case OrderStatus.IN_PROGRESS:
        nextStatus = OrderStatus.READY;
        break;
      case OrderStatus.READY:
        return; // nic nie robimy, bo już w ostatnim statusie
      default:
        return;
    }

    this.orderService.transitionOrderStatus(order.id, nextStatus).subscribe({
      next: (updated) => {
        // odśwież tablicę (można też zaktualizować tylko dany element)
        this.loadOrders();
      },
      error: (err) => {
        this.error = 'Błąd podczas zmiany statusu.';
        console.error(err);
      },
    });
  }

  protected readonly OrderStatus = OrderStatus;
}
