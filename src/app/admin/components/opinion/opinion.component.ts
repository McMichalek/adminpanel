// src/app/components/opinions/opinions.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Opinion, OpinionCreate } from '../../models/opinion.model';
import { OpinionService } from '../../services/opinion.service';

@Component({
  selector: 'app-opinions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Opinie użytkowników</h2>

      <!-- Formularz do dodawania/edytowania opinii -->
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">
            {{ isEditMode ? 'Edytuj opinię' : 'Dodaj nową opinię' }}
          </h5>

          <form (ngSubmit)="onSubmit()" #opForm="ngForm">
            <div class="row">
              <div class="col-md-4 mb-3">
                <label for="restaurantId">restaurant_id:</label>
                <input
                  type="text"
                  id="restaurantId"
                  class="form-control"
                  required
                  name="restaurant_id"
                  [(ngModel)]="form.restaurant_id"
                />
              </div>
              <div class="col-md-4 mb-3">
                <label for="userId">user_id:</label>
                <input
                  type="text"
                  id="userId"
                  class="form-control"
                  required
                  name="user_id"
                  [(ngModel)]="form.user_id"
                />
              </div>
              <div class="col-md-4 mb-3">
                <label for="dishId">dish_id:</label>
                <input
                  type="text"
                  id="dishId"
                  class="form-control"
                  required
                  name="dish_id"
                  [(ngModel)]="form.dish_id"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-md-4 mb-3">
                <label for="rating">rating:</label>
                <input
                  type="number"
                  id="rating"
                  class="form-control"
                  required
                  name="rating"
                  min="1"
                  max="5"
                  [(ngModel)]="form.rating"
                />
              </div>
              <div class="col-md-8 mb-3">
                <label for="comment">comment:</label>
                <input
                  type="text"
                  id="comment"
                  class="form-control"
                  required
                  name="comment"
                  [(ngModel)]="form.comment"
                />
              </div>
            </div>

            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="opForm.invalid"
            >
              {{ isEditMode ? 'Zapisz zmiany' : 'Dodaj opinię' }}
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
      </div>

      <!-- Komunikaty o błędzie / ładowaniu -->
      <div *ngIf="loading" class="alert alert-info">Ładowanie...</div>
      <div *ngIf="error" class="alert alert-danger">{{ error }}</div>

      <!-- Tabela z listą opinii -->
      <table
        *ngIf="!loading && opinions.length > 0"
        class="table table-bordered table-hover"
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>restaurant_id</th>
            <th>user_id</th>
            <th>dish_id</th>
            <th>rating</th>
            <th>comment</th>
            <th>created_at</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let op of opinions">
            <td>{{ op.id }}</td>
            <td>{{ op.restaurant_id }}</td>
            <td>{{ op.user_id }}</td>
            <td>{{ op.dish_id }}</td>
            <td>{{ op.rating }}</td>
            <td>{{ op.comment }}</td>
            <td>{{ op.created_at | date: 'short' }}</td>
            <td>
              <button
                class="btn btn-sm btn-warning me-2"
                (click)="startEdit(op)"
              >
                Edytuj
              </button>
              <button
                class="btn btn-sm btn-danger"
                (click)="onDelete(op.id)"
              >
                Usuń
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="!loading && opinions.length === 0">
        <p>Brak opinii do wyświetlenia.</p>
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
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      thead {
        background-color: #f8f9fa;
      }
    `,
  ],
})
export class OpinionsComponent implements OnInit {
  public opinions: Opinion[] = [];
  public loading = false;
  public error: string | null = null;

  // Form model do tworzenia/edycji
  public form: OpinionCreate = {
    restaurant_id: '',
    user_id: '',
    dish_id: '',
    rating: 1,
    comment: '',
  };

  // Flaga trybu edycji
  public isEditMode = false;
  private editId: string | null = null;

  constructor(private opinionService: OpinionService) {}

  ngOnInit(): void {
    this.fetchOpinions();
  }

  fetchOpinions(): void {
    this.loading = true;
    this.error = null;
    this.opinions = [];

    this.opinionService.getAllOpinions().subscribe({
      next: (data) => {
        this.opinions = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Błąd podczas pobierania opinii.';
        this.loading = false;
      },
    });
  }

  /**
   * Obsługa submita formularza.
   * Jeśli w trybie edycji, wywołuje update, w przeciwnym wypadku dodaje nową opinię.
   */
  onSubmit(): void {
    this.error = null;

    if (this.isEditMode && this.editId) {
      // Tryb edycji
      this.opinionService
        .updateOpinion(this.editId, this.form)
        .subscribe({
          next: (updated) => {
            // Odświeżamy listę lub nadpisujemy w tablicy
            this.fetchOpinions();
            this.resetForm();
          },
          error: (err) => {
            console.error(err);
            this.error = 'Błąd podczas aktualizacji opinii.';
          },
        });
    } else {
      // Tryb dodawania nowej
      this.opinionService.addOpinion(this.form).subscribe({
        next: (created) => {
          // Dodajemy na liście lub pobieramy całą listę od nowa
          this.opinions.unshift(created);
          this.resetForm();
        },
        error: (err) => {
          console.error(err);
          this.error = 'Błąd podczas dodawania opinii.';
        },
      });
    }
  }

  /**
   * Uruchomi tryb edycji: wypełnia form danymi z wybranej opinii.
   */
  startEdit(op: Opinion): void {
    this.isEditMode = true;
    this.editId = op.id;

    this.form = {
      restaurant_id: op.restaurant_id,
      user_id: op.user_id,
      dish_id: op.dish_id,
      rating: op.rating,
      comment: op.comment,
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Anuluje tryb edycji i czyści formularz.
   */
  cancelEdit(): void {
    this.resetForm();
  }

  /**
   * Czyści form i wychodzi z trybu edycji.
   */
  private resetForm(): void {
    this.isEditMode = false;
    this.editId = null;
    this.form = {
      restaurant_id: '',
      user_id: '',
      dish_id: '',
      rating: 1,
      comment: '',
    };
  }

  /**
   * Usuwa opinię zwróconą w tabeli.
   */
  onDelete(id: string): void {
    if (!confirm('Na pewno usunąć tę opinię?')) {
      return;
    }
    this.opinionService.deleteOpinion(id).subscribe({
      next: () => {
        this.opinions = this.opinions.filter((o) => o.id !== id);
      },
      error: (err) => {
        console.error(err);
        this.error = 'Błąd podczas usuwania opinii.';
      },
    });
  }
}
