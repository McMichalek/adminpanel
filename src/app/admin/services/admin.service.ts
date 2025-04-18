import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Restaurant } from '../../models/restaurant.model';
import { Dish } from '../../models/dish.model';
import { Promotion } from '../../models/promotion.model';
import { User } from '../../models/user.model';
import { Order } from '../../models/order.model';
import { StockItem } from '../../models/stock-item.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private restaurants$ = new BehaviorSubject<Restaurant[]>([]);
  private dishes$ = new BehaviorSubject<Dish[]>([]);
  private promotions$ = new BehaviorSubject<Promotion[]>([]);
  private users$ = new BehaviorSubject<User[]>([]);
  private orders$ = new BehaviorSubject<Order[]>([]);
  private stock$ = new BehaviorSubject<StockItem[]>([]);

  // Restaurants
  getRestaurants(): Observable<Restaurant[]> { return this.restaurants$.asObservable(); }
  addRestaurant(r: Restaurant) { this.restaurants$.next([...this.restaurants$.value, r]); }
  updateRestaurant(r: Restaurant) { this.restaurants$.next(this.restaurants$.value.map(x => x.id === r.id ? r : x)); }
  deleteRestaurant(id: number) { this.restaurants$.next(this.restaurants$.value.filter(x => x.id !== id)); }

  // Dishes
  getDishes(): Observable<Dish[]> { return this.dishes$.asObservable(); }
  addDish(d: Dish) { this.dishes$.next([...this.dishes$.value, d]); }
  updateDish(d: Dish) { this.dishes$.next(this.dishes$.value.map(x => x.id === d.id ? d : x)); }
  deleteDish(id: number) { this.dishes$.next(this.dishes$.value.filter(x => x.id !== id)); }

  // Promotions
  getPromotions(): Observable<Promotion[]> { return this.promotions$.asObservable(); }
  addPromotion(p: Promotion) { this.promotions$.next([...this.promotions$.value, p]); }
  updatePromotion(p: Promotion) { this.promotions$.next(this.promotions$.value.map(x => x.id === p.id ? p : x)); }
  deletePromotion(id: number) { this.promotions$.next(this.promotions$.value.filter(x => x.id !== id)); }

  // Users
  getUsers(): Observable<User[]> { return this.users$.asObservable(); }
  addUser(u: User) { this.users$.next([...this.users$.value, u]); }
  updateUser(u: User) { this.users$.next(this.users$.value.map(x => x.id === u.id ? u : x)); }
  deleteUser(id: number) { this.users$.next(this.users$.value.filter(x => x.id !== id)); }

  // Orders
  getOrders(): Observable<Order[]> { return this.orders$.asObservable(); }
  addOrder(o: Order) { this.orders$.next([...this.orders$.value, o]); }
  updateOrder(o: Order) { this.orders$.next(this.orders$.value.map(x => x.id === o.id ? o : x)); }
  deleteOrder(id: number) { this.orders$.next(this.orders$.value.filter(x => x.id !== id)); }

  // Stock
  getStock(): Observable<StockItem[]> { return this.stock$.asObservable(); }
  addStock(s: StockItem) { this.stock$.next([...this.stock$.value, s]); }
  updateStock(s: StockItem) { this.stock$.next(this.stock$.value.map(x => x.id === s.id ? s : x)); }
  deleteStock(id: number) { this.stock$.next(this.stock$.value.filter(x => x.id !== id)); }
}
