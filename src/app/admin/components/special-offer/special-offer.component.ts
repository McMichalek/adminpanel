// src/app/components/special-offers/special-offers.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  SpecialOffer,
  SpecialOfferCreate,
  SpecialOfferUpdate,
} from '../../models/special-offer';
import { SpecialOfferService } from '../../services/special-offer.service';

@Component({
  selector: 'app-special-offers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Panel Ofert Specjalnych</h2>

      <!-- Sekcja: Dodaj / Edytuj ofertę -->
      <div class="card mb-4 p-3">
        <h5>
          {{ isEditMode ? 'Edytuj ofertę' : 'Dodaj nową ofertę' }}
        </h5>

        <form (ngSubmit)="onSubmit()" #offerForm="ngForm">
          <div class="row g-3">
            <!-- Pola wspólne: dish_id i name przy tworzeniu -->
            <div class="col-md-4" *ngIf="!isEditMode">
              <label for="dishId" class="form-label">dish_id:</label>
              <input
                type="text"
                id="dishId"
                name="dish_id"
                class="form-control"
                required
                [(ngModel)]="form.dish_id"
              />
            </div>
            <div class="col-md-4" *ngIf="!isEditMode">
              <label for="name" class="form-label">Nazwa oferty:</label>
              <input
                type="text"
                id="name"
                name="name"
                class="form-control"
                required
                [(ngModel)]="form.name"
              />
            </div>
            <!-- Pole wspólne: price (zarówno przy tworzeniu, jak i przy edycji) -->
            <div class="col-md-4">
              <label for="specialPrice" class="form-label">special_price:</label>
              <input
                type="number"
                id="specialPrice"
                name="special_price"
                class="form-control"
                required
                min="0"
                step="0.01"
                [(ngModel)]="form.special_price"
              />
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary mt-3"
            [disabled]="offerForm.invalid"
          >
            {{ isEditMode ? 'Zapisz zmiany' : 'Utwórz ofertę' }}
          </button>
          <button
            type="button"
            class="btn btn-secondary ms-2 mt-3"
            *ngIf="isEditMode"
            (click)="cancelEdit()"
          >
            Anuluj edycję
          </button>
        </form>
      </div>

      <!-- Komunikaty o błędzie / ładowaniu -->
      <div *ngIf="loading" class="alert alert-info">Ładowanie...</div>
      <div *ngIf="error" class="alert alert-danger">{{ error }}</div>

      <!-- Tabela: lista wszystkich ofert -->
      <div class="card p-3">
        <h5>Wszystkie oferty specjalne</h5>

        <table
          *ngIf="!loading && offers.length > 0"
          class="table table-bordered table-hover mt-3"
        >
          <thead>
          <tr>
            <th>ID</th>
            <th>dish_id</th>
            <th>Nazwa</th>
            <th>special_price</th>
            <th>Akcje</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let o of offers">
            <td>{{ o.id }}</td>
            <td>{{ o.dish_id }}</td>
            <td>{{ o.name }}</td>
            <td>{{ o.special_price | number: '1.2-2' }}</td>
            <td>
              <!-- Edycja ceny -->
              <button
                class="btn btn-sm btn-warning me-2"
                (click)="startEdit(o)"
              >
                Edytuj cenę
              </button>
              <!-- Usuwanie oferty -->
              <button
                class="btn btn-sm btn-danger me-2"
                (click)="onDelete(o.id)"
              >
                Usuń
              </button>
              <!-- Przypisz do restauracji -->
              <button
                class="btn btn-sm btn-success me-2"
                (click)="onAddToRestaurant(o.id)"
              >
                Przypisz do restauracji
              </button>
              <!-- Usuń przypisanie od restauracji -->
              <button
                class="btn btn-sm btn-secondary"
                (click)="onRemoveFromRestaurant(o.id)"
              >
                Usuń z restauracji
              </button>
            </td>
          </tr>
          </tbody>
        </table>

        <div *ngIf="!loading && offers.length === 0">
          <p>Brak ofert specjalnych.</p>
        </div>
      </div>
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
    `,
  ],
})
export class SpecialOffersComponent implements OnInit {
  public offers: SpecialOffer[] = [];
  public loading = false;
  public error: string | null = null;

  // Form model: przy tworzeniu używamy dish_id, name, special_price;
  // przy edycji – tylko special_price (pole dish_id i name są niewidoczne w trybie edycji).
  public form: SpecialOfferCreate & Partial<SpecialOfferUpdate> = {
    dish_id: '',
    name: '',
    special_price: 0,
  };

  public isEditMode = false;
  private editId: string | null = null;

  constructor(private specialOfferService: SpecialOfferService) {}

  ngOnInit(): void {
    this.fetchAllOffers();
  }

  /**
   * Pobierz wszystkie oferty z backendu.
   */
  fetchAllOffers(): void {
    this.loading = true;
    this.error = null;
    this.offers = [];

    this.specialOfferService.getAllOffers().subscribe({
      next: (data) => {
        this.offers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Błąd podczas pobierania ofert.';
        this.loading = false;
      },
    });
  }

  /**
   * Obsługa submitu formularza.
   * - Jeśli w trybie edycji, wywołaj PUT /{offer_id},
   * - W przeciwnym razie – POST /create.
   */
  onSubmit(): void {
    this.error = null;

    if (this.isEditMode && this.editId) {
      // Tryb edycji: aktualizujemy tylko cenę
      const payload: SpecialOfferUpdate = {
        special_price: Number(this.form.special_price),
      };
      this.specialOfferService
        .updateOffer(this.editId, payload)
        .subscribe({
          next: (updated) => {
            // Zaktualizuj w tablicy
            const idx = this.offers.findIndex((o) => o.id === this.editId);
            if (idx !== -1) {
              this.offers[idx] = updated;
            }
            this.resetForm();
          },
          error: (err) => {
            console.error(err);
            this.error = 'Błąd podczas aktualizacji oferty.';
          },
        });
    } else {
      // Tryb tworzenia nowej oferty
      const payload: SpecialOfferCreate = {
        dish_id: this.form.dish_id!.trim(),
        name: this.form.name!.trim(),
        special_price: Number(this.form.special_price),
      };

      this.specialOfferService.createOffer(payload).subscribe({
        next: (created) => {
          this.offers.unshift(created);
          this.resetForm();
        },
        error: (err) => {
          console.error(err);
          this.error = 'Błąd podczas tworzenia oferty.';
        },
      });
    }
  }

  /**
   * Rozpocznij edycję danej oferty: wypełnij pole do zmiany ceny.
   * Ukrywamy pola dish_id i name (po utworzeniu nie zmieniamy ich).
   */
  startEdit(o: SpecialOffer): void {
    this.isEditMode = true;
    this.editId = o.id;
    this.form = {
      special_price: o.special_price,
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Anuluje tryb edycji i czyści formularz.
   */
  cancelEdit(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.isEditMode = false;
    this.editId = null;
    this.form = {
      dish_id: '',
      name: '',
      special_price: 0,
    };
  }

  /**
   * Usuń ofertę (DELETE /{offer_id}).
   */
  onDelete(offerId: string): void {
    if (!confirm('Na pewno usunąć tę ofertę?')) {
      return;
    }
    this.specialOfferService.deleteOffer(offerId).subscribe({
      next: (_) => {
        this.offers = this.offers.filter((o) => o.id !== offerId);
      },
      error: (err) => {
        console.error(err);
        this.error = 'Błąd podczas usuwania oferty.';
      },
    });
  }

  /**
   * Przypisz ofertę do restauracji (POST /restaurant/{restaurant_id}/offer/{offer_id}).
   * Pyta użytkownika o ID restauracji.
   */
  onAddToRestaurant(offerId: string): void {
    const restaurantId = prompt(
      `Podaj ID restauracji, do której przypisać ofertę [${offerId}]:`
    );
    if (!restaurantId) {
      return;
    }
    this.specialOfferService
      .addOfferToRestaurant(restaurantId.trim(), offerId)
      .subscribe({
        next: (res) => {
          alert(res.message || 'Oferta została przypisana do restauracji.');
        },
        error: (err) => {
          console.error(err);
          this.error = 'Błąd podczas przypisywania oferty.';
        },
      });
  }

  /**
   * Usuń przypisanie oferty od restauracji (DELETE /restaurant/{restaurant_id}/offer/{offer_id}).
   * Pyta użytkownika o ID restauracji.
   */
  onRemoveFromRestaurant(offerId: string): void {
    const restaurantId = prompt(
      `Podaj ID restauracji, z której usunąć ofertę [${offerId}]:`
    );
    if (!restaurantId) {
      return;
    }
    this.specialOfferService
      .removeOfferFromRestaurant(restaurantId.trim(), offerId)
      .subscribe({
        next: (res) => {
          alert(res.message || 'Oferta została usunięta z restauracji.');
        },
        error: (err) => {
          console.error(err);
          this.error = 'Błąd podczas usuwania przypisania oferty.';
        },
      });
  }
}
