import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Restaurant } from '../../../models/restaurant.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-restaurant-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.css']
})
export class RestaurantListComponent implements OnInit {
  restaurants: Restaurant[] = [];

  constructor(private admin: AdminService) {}

  ngOnInit(): void {
    this.admin.getRestaurants().subscribe(restaurants => {
      this.restaurants = restaurants;
    });
  }

  delete(id: string): void {
    this.admin.deleteRestaurant(id);
    this.restaurants = this.restaurants.filter(r => r.id !== id);
  }
}
