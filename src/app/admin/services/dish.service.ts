// src/app/services/dish.service.ts

import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Dish, DishCreate, DishUpdate } from '../models/dish.model';
import { AuthService } from './auth.service'; // załóżmy, że to ścieżka do Twojego AuthService

@Injectable({
  providedIn: 'root',
})
export class DishService {
  /**
   * Zakładamy, że Twój FastAPI ma prefix /dish/panel.
   * Dostosuj baseUrl do faktycznego endpointu backendu.
   */
  private baseUrl = 'http://localhost:80/dish/panel';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /** GET /dish/panel/all – pobierz wszystkie dania z nagłówkiem Bearer */
  getAllDishes(): Observable<Dish[]> {
    const url = `${this.baseUrl}/list_dishes`;
    console.log(url);
    // 1) Zamieniamy promise na Observable (from)
    // 2) switchMap pobiera token i dopiero wtedy robi GET z odpowiednim headerem
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

  /** GET /dish/panel/{id} – pobierz dane jednego dania */
  getDishById(dishId: string): Observable<Dish> {
    const url = `${this.baseUrl}/${dishId}`;
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

  /** POST /dish/panel/create – utwórz nowe danie */
  createDish(data: DishCreate): Observable<Dish> {
    const url = `${this.baseUrl}/create`;
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

  /** PUT /dish/panel/update/{id} – zaktualizuj dane dania */
  updateDish(dishId: string, data: DishUpdate): Observable<Dish> {
    const url = `${this.baseUrl}/update/${dishId}`;
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

  /** DELETE /dish/panel/delete/{id} – usuń danie */
  deleteDish(dishId: string): Observable<{ message: string }> {
    const url = `${this.baseUrl}/delete/${dishId}`;
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
