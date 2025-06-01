// src/app/services/dish.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dish, DishCreate, DishUpdate } from '../models/dish.model';

@Injectable({
  providedIn: 'root',
})
export class DishService {
  /**
   * Załóżmy, że Twój FastAPI ma prefix np. /dish/panel.
   * Dostosuj baseUrl do faktycznego endpointu backendu.
   */
  private baseUrl = 'http://localhost:80/dish/panel';

  constructor(private http: HttpClient) {}

  /** GET /dish/panel/all – pobierz wszystkie dania */
  getAllDishes(): Observable<Dish[]> {
    const url = `${this.baseUrl}/all`;
    return this.http.get<Dish[]>(url);
  }

  /** GET /dish/panel/{id} – pobierz dane jednego dania */
  getDishById(dishId: string): Observable<Dish> {
    const url = `${this.baseUrl}/${dishId}`;
    return this.http.get<Dish>(url);
  }

  /** POST /dish/panel/create – utwórz nowe danie */
  createDish(data: DishCreate): Observable<Dish> {
    const url = `${this.baseUrl}/create`;
    return this.http.post<Dish>(url, data);
  }

  /** PUT /dish/panel/update/{id} – zaktualizuj dane dania */
  updateDish(dishId: string, data: DishUpdate): Observable<Dish> {
    const url = `${this.baseUrl}/update/${dishId}`;
    return this.http.put<Dish>(url, data);
  }

  /** DELETE /dish/panel/delete/{id} – usuń danie */
  deleteDish(dishId: string): Observable<{ message: string }> {
    const url = `${this.baseUrl}/delete/${dishId}`;
    return this.http.delete<{ message: string }>(url);
  }
}
