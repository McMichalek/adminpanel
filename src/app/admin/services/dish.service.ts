// src/app/services/dish.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Dish, DishCreate, DishUpdate } from '../models/dish.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class DishService {
  /**
   * Base URL do FastAPI:
   * Backend nasłuchuje na /dish/panel, a port to 80.
   */
  private baseUrl = 'http://localhost:80/dish/panel';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /** GET /dish/panel/list_dishes – pobierz wszystkie dania */
  getAllDishes(): Observable<Dish[]> {
    const url = `${this.baseUrl}/list_dishes`;
    return from(this.authService.getUserToken()).pipe(
      switchMap(tokens => {
        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${tokens.idToken}`
        );
        return this.http.get<Dish[]>(url, { headers });
      })
    );
  }

  /** GET /dish/panel/get_dish_by_id/{dishId} – pobierz dane pojedynczego dania */
  getDishById(dishId: string): Observable<Dish> {
    const url = `${this.baseUrl}/get_dish_by_id/${dishId}`;
    return from(this.authService.getUserToken()).pipe(
      switchMap(tokens => {
        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${tokens.idToken}`
        );
        return this.http.get<Dish>(url, { headers });
      })
    );
  }

  /** POST /dish/panel/add_dish – utwórz nowe danie (pole price) */
  createDish(data: DishCreate): Observable<Dish> {
    const url = `${this.baseUrl}/add_dish`;
    return from(this.authService.getUserToken()).pipe(
      switchMap(tokens => {
        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${tokens.idToken}`
        );
        return this.http.post<Dish>(url, data, { headers });
      })
    );
  }

  /** PUT /dish/panel/update_dish/{dishId} – zaktualizuj danie (pole price) */
  updateDish(dishId: string, data: DishUpdate): Observable<Dish> {
    const url = `${this.baseUrl}/update_dish/${dishId}`;
    return from(this.authService.getUserToken()).pipe(
      switchMap(tokens => {
        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${tokens.idToken}`
        );
        return this.http.put<Dish>(url, data, { headers });
      })
    );
  }

  /** DELETE /dish/panel/delete_dish/{dishId} – usuń danie */
  deleteDish(dishId: string): Observable<{ message: string }> {
    const url = `${this.baseUrl}/delete_dish/${dishId}`;
    return from(this.authService.getUserToken()).pipe(
      switchMap(tokens => {
        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${tokens.idToken}`
        );
        return this.http.delete<{ message: string }>(url, { headers });
      })
    );
  }
}
