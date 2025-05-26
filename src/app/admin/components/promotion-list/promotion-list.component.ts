import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { Promotion } from '../../../models/promotion.model';
import { Dish } from '../../../models/dish.model';
import { Restaurant } from '../../../models/restaurant.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-promotion-list',
  templateUrl: './promotion-list.component.html',
  styleUrls: ['./promotion-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class PromotionListComponent implements OnInit {
  promotions$!: Observable<Promotion[]>;
  dishes: Dish[] = [];
  restaurants: Restaurant[] = [];

  constructor(private admin: AdminService) {}

  ngOnInit(): void {
    this.promotions$ = this.admin.getPromotions();
    this.admin.getDishes().subscribe(d => this.dishes = d);
    this.admin.getRestaurants().subscribe(r => this.restaurants = r);
  }

  getDishName(dishId: string): string {
    return this.dishes.find(d => d.id === dishId)?.name || '—';
  }

  getRestaurantName(restaurantId: string): string {
    return this.restaurants.find(r => r.id === restaurantId)?.name || '—';
  }

  delete(dishId: string, name: string) {
    this.admin.deletePromotion(dishId, name);
  }
}