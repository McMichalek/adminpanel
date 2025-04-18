import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { Restaurant } from '../../../models/restaurant.model';
import {RouterLink, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  standalone: true,

  imports: [CommonModule, RouterModule,RouterLink],
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html'
})
export class RestaurantListComponent implements OnInit {
  restaurants$!: Observable<Restaurant[]>;

  constructor(private admin: AdminService) {}

  ngOnInit(): void {
    this.restaurants$ = this.admin.getRestaurants();
  }

  delete(id: number): void {
    this.admin.deleteRestaurant(id);
  }
}
