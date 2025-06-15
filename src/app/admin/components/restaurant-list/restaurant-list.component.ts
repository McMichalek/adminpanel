import {Component, OnInit} from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Restaurant } from '../../../models/restaurant.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-restaurant-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.css']
})
export class RestaurantListComponent implements OnInit {
  restaurants$!: Observable<Restaurant[]>;

  constructor(private admin: AdminService) {}

  ngOnInit(): void {
    this.restaurants$ = this.admin.getRestaurants();
  }

  delete(id: string): void {
    this.admin.deleteRestaurant(id);
  }
}
