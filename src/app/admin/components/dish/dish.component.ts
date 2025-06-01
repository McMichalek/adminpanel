// src/app/components/dish/dish.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Dish, DishCreate, DishUpdate } from '../../models/dish.model';
import { DishService } from '../../services/dish.service';

@Component({
  selector: 'app-dish-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dish.component.html',
  styleUrls: ['./dish.component.css'],
})
export class DishPanelComponent implements OnInit {
  public dishes: Dish[] = [];
  public loading = false;
  public error: string | null = null;

  /** Formularz tworzenia – zawsze wymagane name, description, price (category opcjonalnie) */
  public createForm: DishCreate = {
    name: '',
    description: '',
    price: 0,
    category: '',
  };

  /** Formularz edycji – pola opcjonalne; przed edycją wypełnimy go konkretnymi wartościami */
  public updateForm: DishUpdate = {};

  public isEditMode = false;
  private editId: string | null = null;

  constructor(private dishService: DishService) {}

  ngOnInit(): void {
    this.fetchAllDishes();
  }

  /** Pobierz wszystkie dania z backendu */
  fetchAllDishes(): void {
    this.loading = true;
    this.error = null;
    this.dishes = [];

    this.dishService.getAllDishes().subscribe({
      next: (data) => {
        this.dishes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Błąd podczas pobierania listy dań.';
        this.loading = false;
      },
    });
  }

  /** Obsługa przycisku „Zapisz” w formularzu (tryb tworzenie lub edycja) */
  onSubmit(): void {
    this.error = null;

    if (this.isEditMode && this.editId) {
      // Tryb edycji: wysyłamy tylko te pola, które użytkownik zmienił (updateForm)
      this.dishService.updateDish(this.editId, this.updateForm).subscribe({
        next: (updatedDish) => {
          // Zaktualizuj w tablicy
          const idx = this.dishes.findIndex((d) => d.id === this.editId);
          if (idx !== -1) {
            this.dishes[idx] = updatedDish;
          }
          this.resetForm();
        },
        error: (err) => {
          console.error(err);
          this.error = 'Błąd podczas aktualizacji dania.';
        },
      });
    } else {
      // Tryb tworzenia: musimy przekazać createForm (wszystkie wymagane pola)
      this.dishService.createDish(this.createForm).subscribe({
        next: (createdDish) => {
          // Dodajemy nowo utworzone danie na początek listy
          this.dishes.unshift(createdDish);
          this.resetForm();
        },
        error: (err) => {
          console.error(err);
          this.error = 'Błąd podczas tworzenia nowego dania.';
        },
      });
    }
  }

  /** Rozpocznij edycję – wypełnij updateForm danymi wybranego dania */
  startEdit(d: Dish): void {
    this.isEditMode = true;
    this.editId = d.id;
    this.updateForm = {
      name: d.name,
      description: d.description,
      price: d.price,
      category: d.category,
    };
    // Przewiń do góry/ do formularza
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** Anuluj tryb edycji, wyczyść formularze */
  cancelEdit(): void {
    this.resetForm();
  }

  /** Usuń danie po ID (z potwierdzeniem) */
  onDelete(dishId: string): void {
    if (!confirm('Na pewno usunąć to danie?')) {
      return;
    }
    this.dishService.deleteDish(dishId).subscribe({
      next: (_) => {
        this.dishes = this.dishes.filter((d) => d.id !== dishId);
      },
      error: (err) => {
        console.error(err);
        this.error = 'Błąd podczas usuwania dania.';
      },
    });
  }

  /** Reset wszystkich formularzy i trybu edycji */
  private resetForm(): void {
    this.isEditMode = false;
    this.editId = null;
    this.createForm = {
      name: '',
      description: '',
      price: 0,
      category: '',
    };
    this.updateForm = {};
  }
}
