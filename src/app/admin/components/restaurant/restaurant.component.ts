// src/app/components/restaurants/restaurants.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Restaurant,
  RestaurantCreate,
} from '../../models/restuarant';
import { RestaurantService } from '../../services/resturant.service';

@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Panel Zarządzania Restauracjami</h2>

      <!-- Sekcja: Pobierz restaurację po ID -->
      <div class="card mb-4 p-3">
        <h5>Pobierz restaurację po ID</h5>
        <div class="row g-2 align-items-center">
          <div class="col-auto">
            <input
              type="text"
              class="form-control"
              placeholder="Wprowadź ID restauracji"
              [(ngModel)]="fetchId"
            />
          </div>
          <div class="col-auto">
            <button
              class="btn btn-primary"
              (click)="onFetchById()"
              [disabled]="!fetchId"
            >
              Pobierz
            </button>
          </div>
        </div>

        <div *ngIf="fetchedRestaurant" class="mt-3">
          <h6>Uzyskane dane:</h6>
          <pre>{{ fetchedRestaurant | json }}</pre>
        </div>
      </div>

      <!-- Formularz: Dodaj / Edytuj restaurację -->
      <div class="card mb-4 p-3">
        <h5>
          {{ isEditMode ? 'Edytuj istniejącą restaurację' : 'Dodaj nową restaurację' }}
        </h5>

        <form (ngSubmit)="onSubmit()" #restForm="ngForm">
          <div class="mb-3">
            <label for="name" class="form-label">Nazwa:</label>
            <input
              type="text"
              id="name"
              name="name"
              class="form-control"
              required
              [(ngModel)]="form.name"
            />
          </div>

          <div class="mb-3">
            <label for="address" class="form-label">Adres:</label>
            <input
              type="text"
              id="address"
              name="address"
              class="form-control"
              required
              [(ngModel)]="form.address"
            />
          </div>

          <div class="mb-3">
            <label for="phone" class="form-label">Telefon:</label>
            <input
              type="text"
              id="phone"
              name="phone"
              class="form-control"
              required
              [(ngModel)]="form.phone"
            />
          </div>

          <button
            type="submit"
            class="btn btn-success"
            [disabled]="restForm.invalid"
          >
            {{ isEditMode ? 'Zapisz zmiany' : 'Dodaj restaurację' }}
          </button>
          <button
            type="button"
            class="btn btn-secondary ms-2"
            *ngIf="isEditMode"
            (click)="cancelEdit()"
          >
            Anuluj edycję
          </button>
        </form>
      </div>

      <!-- Tabela z listą restauracji (zrobimy lokalnie, żeby pokazać dodawanie i usuwanie w interfejsie) -->
      <div class="card mb-4 p-3">
        <h5>Wszystkie dodane restauracje (tylko w UI)</h5>
        <p class="text-muted">
          Uwaga: Backend nie ma endpointa “get_all_restaurants”, więc tutaj
          przechowujemy listę lokalnie. Żeby zobaczyć realne dane z serwera,
          użyjcie “Pobierz po ID” powyżej.
        </p>
        <table
          *ngIf="restaurants.length > 0"
          class="table table-bordered table-hover mt-3"
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Nazwa</th>
              <th>Adres</th>
              <th>Telefon</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of restaurants">
              <td>{{ r.id }}</td>
              <td>{{ r.name }}</td>
              <td>{{ r.address }}</td>
              <td>{{ r.phone }}</td>
              <td>
                <button
                  class="btn btn-sm btn-warning me-2"
                  (click)="startEdit(r)"
                >
                  Edytuj
                </button>
                <button
                  class="btn btn-sm btn-danger me-2"
                  (click)="onDelete(r.id)"
                >
                  Usuń
                </button>
                <button
                  class="btn btn-sm btn-info"
                  (click)="onAddDishToMenu(r.id)"
                >
                  Dodaj danie do menu
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="restaurants.length === 0">
          <p>Brak dodanych restauracji.</p>
        </div>
      </div>

      <!-- Komunikaty o błędzie / loading -->
      <div *ngIf="loading" class="alert alert-info">Ładowanie...</div>
      <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 900px;
        margin: 20px auto;
      }
      .card {
        border-radius: 6px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
      }
      pre {
        background-color: #f8f9fa;
        padding: 10px;
        border-radius: 4px;
      }
    `,
  ],
})
export class RestaurantsComponent implements OnInit {
  /** Dane pobranej z serwera restauracji (po ID) */
  public fetchedRestaurant: Restaurant | null = null;
  public fetchId = '';

  /** Formularz do dodawania/edycji */
  public form: RestaurantCreate = {
    name: '',
    address: '',
    phone: '',
  };
  public isEditMode = false;
  private editId: string | null = null;

  /** Lista “lokalnych” restauracji (tylko dla UI, bo backend nie ma GET-all) */
  public restaurants: Restaurant[] = [];

  public loading = false;
  public error: string | null = null;

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    // Nie pobieramy nic od razu, bo backend nie ma “get all”.
    // Użytkownik może: pobrać pojedynczo, dodać nową lub edytować/usunąć.
  }

  /**
   * Pobierz restaurację po ID
   */
  onFetchById(): void {
    if (!this.fetchId) {
      return;
    }
    this.error = null;
    this.loading = true;
    this.fetchedRestaurant = null;

    this.restaurantService.getRestaurantById(this.fetchId).subscribe({
      next: (data) => {
        this.fetchedRestaurant = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Błąd podczas pobierania restauracji.';
        this.loading = false;
      },
    });
  }

  /**
   * Obsługa submitu formularza:
   * - w trybie edycji (isEditMode=true) → updateRestaurant
   * - w trybie “dodaj” → addRestaurant
   */
  onSubmit(): void {
    this.error = null;

    if (this.isEditMode && this.editId) {
      // Tryb edycji
      this.restaurantService
        .updateRestaurant(this.editId, this.form)
        .subscribe({
          next: (updated) => {
            // Zaktualizuj lokalnie listę i reset
            const idx = this.restaurants.findIndex((r) => r.id === this.editId);
            if (idx !== -1) {
              this.restaurants[idx] = updated;
            }
            this.resetForm();
          },
          error: (err) => {
            console.error(err);
            this.error = 'Błąd podczas aktualizacji restauracji.';
          },
        });
    } else {
      // Tryb dodawania nowej restauracji
      this.restaurantService.addRestaurant(this.form).subscribe({
        next: (created) => {
          // Dodaj do lokalnej listy (można też od razu się “prze”przekierować)
          this.restaurants.unshift(created);
          this.resetForm();
        },
        error: (err) => {
          console.error(err);
          this.error = 'Błąd podczas dodawania restauracji.';
        },
      });
    }
  }

  /**
   * Ustawia tryb edycji – wypełnia formularz danymi istniejącej restauracji
   */
  startEdit(r: Restaurant): void {
    this.isEditMode = true;
    this.editId = r.id;
    this.form = {
      name: r.name,
      address: r.address,
      phone: r.phone,
      // …jeśli są inne pola, dodaj je analogicznie
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Anuluje tryb edycji i czyści formularz
   */
  cancelEdit(): void {
    this.resetForm();
  }

  /**
   * Czyści formularz i wyłącza tryb edycji
   */
  private resetForm(): void {
    this.isEditMode = false;
    this.editId = null;
    this.form = {
      name: '',
      address: '',
      phone: '',
    };
  }

  /**
   * Usuwa restaurację po ID
   */
  onDelete(id: string): void {
    if (!confirm('Na pewno usunąć tę restaurację?')) {
      return;
    }
    this.restaurantService.deleteRestaurant(id).subscribe({
      next: (_) => {
        this.restaurants = this.restaurants.filter((r) => r.id !== id);
      },
      error: (err) => {
        console.error(err);
        this.error = 'Błąd podczas usuwania restauracji.';
      },
    });
  }

  /**
   * Wywołuje endpoint PUT /update_menu/{restaurant_id}/{dish_id}
   * Dla uproszczenia pytamy użytkownika o ID dania (prompt),
   * a po udanym dodaniu wyświetlamy komunikat.
   */
  onAddDishToMenu(restaurantId: string): void {
    const dishId = prompt(
      `Podaj ID dania, które chcesz dodać do menu restauracji [${restaurantId}]:`
    );
    if (!dishId) {
      return;
    }
    this.restaurantService
      .addDishToMenu(restaurantId, dishId)
      .subscribe({
        next: (res) => {
          alert(res.message || 'Danie zostało dodane do menu.');
        },
        error: (err) => {
          console.error(err);
          this.error = 'Błąd podczas dodawania dania do menu.';
        },
      });
  }
}
