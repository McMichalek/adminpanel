// src/app/services/restaurant.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Restaurant, RestaurantCreate } from '../models/restuarant';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  /**
   * Bazowy URL do FastAPI (dostosuj host i port, jeśli inaczej).
   * Zwróć uwagę: backend definiuje router z prefixem '/restaurant/panel'.
   */
  private baseUrl = 'http://localhost:80/restaurant/panel';

  constructor(private http: HttpClient) {}

  /**
   * GET /restaurant/panel/get_restaurant_by_id/{restaurant_id}
   */
  getRestaurantById(restaurantId: string): Observable<Restaurant> {
    const url = `${this.baseUrl}/get_restaurant_by_id/${restaurantId}`;
    return this.http.get<Restaurant>(url);
  }

  /**
   * POST /restaurant/panel/add_restaurant
   */
  addRestaurant(data: RestaurantCreate): Observable<Restaurant> {
    const url = `${this.baseUrl}/add_restaurant`;
    return this.http.post<Restaurant>(url, data);
  }

  /**
   * PUT /restaurant/panel/update_restaurant/{restaurant_id}
   */
  updateRestaurant(
    restaurantId: string,
    data: RestaurantCreate
  ): Observable<Restaurant> {
    const url = `${this.baseUrl}/update_restaurant/${restaurantId}`;
    return this.http.put<Restaurant>(url, data);
  }

  /**
   * DELETE /restaurant/panel/delete_restaurant/{restaurant_id}
   */
  deleteRestaurant(restaurantId: string): Observable<{ message: string }> {
    const url = `${this.baseUrl}/delete_restaurant/${restaurantId}`;
    return this.http.delete<{ message: string }>(url);
  }

  /**
   * PUT /restaurant/panel/update_menu/{restaurant_id}/{dish_id}
   * Dodaje danie (dish_id) do menu restauracji (restaurant_id).
   */
  addDishToMenu(
    restaurantId: string,
    dishId: string
  ): Observable<{ message: string }> {
    const url = `${this.baseUrl}/update_menu/${restaurantId}/${dishId}`;
    // Backend w kodzie nie przyjmuje ciała, tylko parametry w URL
    return this.http.put<{ message: string }>(url, null);
  }
}
