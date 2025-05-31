import { Component, OnInit } from '@angular/core';
import { DishService } from '../../services/dish.service';
import { Dish } from '../../models/dish.model';

@Component({
  selector: 'app-dish',
  templateUrl: './dish.component.html',
  standalone: true,
  styleUrls: ['./dish.component.css']
})
export class DishPanelComponent implements OnInit {
  public dishes: Dish[] = [];
  public selectedDish?: Dish;
  public errorMessage: string = '';

  constructor(private dishService: DishService) {}

  ngOnInit(): void {
    this.loadAllDishes();
  }

  loadAllDishes(): void {
    this.dishService.listDishes().subscribe({
      next: (result: Dish[]) => {
        this.dishes = result;
      },
      error: (err) => {
        this.errorMessage = `Nie udało się pobrać listy dań: ${err.message || err.statusText}`;
      }
    });
  }

  loadDishDetail(id: string): void {
    this.dishService.getDishById(id).subscribe({
      next: (dish: Dish) => {
        this.selectedDish = dish;
      },
      error: (err) => {
        this.errorMessage = `Nie udało się pobrać dania: ${err.message || err.statusText}`;
      }
    });
  }

  createNewDish(): void {
    const newDish: Dish = {
      id: '', // w addDish nie uwzględniamy pola id, backend wygeneruje
      name: 'Nowe Danie',
      description: 'Opis nowego dania',
      price: 30,
      ingredients: 'składniki...',
      points: 5,
      stockCount: 20,
      isAvailable: true
      // promoPrice?: number
    };

    this.dishService.addDish(newDish).subscribe({
      next: (created: Dish) => {
        console.log('Dodano danie:', created);
        this.loadAllDishes();
      },
      error: (err) => {
        this.errorMessage = `Nie udało się dodać dania: ${err.message || err.statusText}`;
      }
    });
  }

  updateExistingDish(): void {
    if (!this.selectedDish) return;

    const updated: Dish = {
      ...this.selectedDish,
      price: this.selectedDish.price + 5 // przykładowa zmiana
    };

    this.dishService.updateDish(updated.id, updated).subscribe({
      next: (res: Dish) => {
        console.log('Zaktualizowano danie:', res);
        this.loadAllDishes();
      },
      error: (err) => {
        this.errorMessage = `Nie udało się zaktualizować dania: ${err.message || err.statusText}`;
      }
    });
  }

  deleteDishById(id: string): void {
    this.dishService.deleteDish(id).subscribe({
      next: () => {
        console.log('Usunięto danie o ID:', id);
        this.loadAllDishes();
      },
      error: (err) => {
        this.errorMessage = `Nie udało się usunąć dania: ${err.message || err.statusText}`;
      }
    });
  }
}
