
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Dish } from '../models/dish.model';
import { AuthService } from './auth.service';
// import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DishService {
  /**
   * Bazowy URL do endpointów FastAPI
   * Zakładam, że w environment masz coś w stylu:
   *   apiUrl: 'https://twoj-backend.example.com'
   * Jeśli nie masz, możesz zamienić na pusty string lub konkretną ścieżkę.
   */
  // private readonly baseUrl = `${environment.apiUrl}/dish/panel`;
  private readonly baseUrl = "localhost80/dish/panel";

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Pomocnicza metoda zwracająca nagłówki z poprawnym Bearer Tokenem
   * Pobiera token z AuthService.getUserToken(), który zwraca obiekt zawierający m.in. idToken.
   */
  private getAuthHeaders(): Observable<HttpHeaders> {
    return from(this.authService.getUserToken()).pipe(
      switchMap(tokens => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${tokens.idToken}`,
        });
        return new Observable<HttpHeaders>(subscriber => {
          subscriber.next(headers);
          subscriber.complete();
        });
      })
    );
  }

  /**
   * Pobiera dane dania o podanym ID.
   * Zwraca Observable<Dish>.
   */
  getDishById(dishId: string): Observable<Dish> {
    return this.getAuthHeaders().pipe(
      switchMap(headers =>
        this.http.get<Dish>(`${this.baseUrl}/get_dish_by_id/${dishId}`, { headers })
      )
    );
  }

  /**
   * Listuje wszystkie dostępne dania.
   * Zwraca Observable<Dish[]>.
   */
  listDishes(): Observable<Dish[]> {
    return this.getAuthHeaders().pipe(
      switchMap(headers =>
        this.http.get<Dish[]>(`${this.baseUrl}/list_dishes`, { headers })
      )
    );
  }

  /**
   * Dodaje nowe danie do bazy.
   * Zwraca Observable<Dish> z utworzonym obiektem (wraz z wygenerowanym ID).
   */
  addDish(newDish: Dish): Observable<Dish> {
    return this.getAuthHeaders().pipe(
      switchMap(headers =>
        this.http.post<Dish>(`${this.baseUrl}/add_dish`, newDish, { headers })
      )
    );
  }

  /**
   * Aktualizuje istniejące danie o podanym ID.
   * Zwraca Observable<Dish> z zaktualizowanymi danymi.
   */
  updateDish(dishId: string, updatedDish: Dish): Observable<Dish> {
    return this.getAuthHeaders().pipe(
      switchMap(headers =>
        this.http.put<Dish>(`${this.baseUrl}/update_dish/${dishId}`, updatedDish, { headers })
      )
    );
  }

  /**
   * Usuwa danie o podanym ID.
   * Zwraca Observable<any> (może zawierać wiadomość o sukcesie).
   */
  deleteDish(dishId: string): Observable<any> {
    return this.getAuthHeaders().pipe(
      switchMap(headers =>
        this.http.delete<any>(`${this.baseUrl}/delete_dish/${dishId}`, { headers })
      )
    );
  }
}
