import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { Restaurant } from '../../../models/restaurant.model';

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html'
})
export class RestaurantListComponent implements OnInit {
  restaurants$!: Observable<Restaurant[]>;
  constructor(private admin: AdminService) {}
  ngOnInit() { this.restaurants$ = this.admin.getRestaurants(); }
  delete(id: number) { this.admin.deleteRestaurant(id); }
}
