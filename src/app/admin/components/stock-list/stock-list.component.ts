import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { StockItem } from '../../../models/stock-item.model';
import { Dish } from '../../../models/dish.model';
import { Restaurant } from '../../../models/restaurant.model';
import {RouterLink, RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-stock-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css']
})
export class StockListComponent implements OnInit {
  allStock: StockItem[] = [];
  filteredStock: StockItem[] = [];
  dishes: Dish[] = [];
  restaurants: Restaurant[] = [];
  selectedRestaurantId: number | null = null;
  selectedDishId: number | null = null;

  constructor(private admin: AdminService) {}
  getRestaurantName(id: number): string {
    const r = this.restaurants.find(r => r.id === id);
    return r ? r.name : String(id);
  }

  getDishName(id: number): string {
    const d = this.dishes.find(d => d.id === id);
    return d ? d.name : String(id);
  }
  ngOnInit(): void {
    this.admin.getStock().subscribe(stock => {
      this.allStock = stock;
      this.filteredStock = stock;
    });
    this.admin.getDishes().subscribe(d => this.dishes = d);
    this.admin.getRestaurants().subscribe(r => this.restaurants = r);
  }

  filter(): void {
    this.filteredStock = this.allStock.filter(s => {
      const byRest = this.selectedRestaurantId ? s.restaurantId === +this.selectedRestaurantId : true;
      const byDish = this.selectedDishId ? s.dishId === +this.selectedDishId : true;
      return byRest && byDish;
    });
  }

  delete(id: number): void {
    this.admin.deleteStock(id);
    this.filteredStock = this.filteredStock.filter(s => s.id !== id);
  }

}
