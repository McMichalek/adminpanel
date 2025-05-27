import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Restaurant } from '../../models/restaurant.model';
import { Dish } from '../../models/dish.model';
import { Promotion } from '../../models/promotion.model';
import { User } from '../../models/user.model';
import { Order } from '../../models/order.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private restaurants$ = new BehaviorSubject<Restaurant[]>([]);
  private dishes$ = new BehaviorSubject<Dish[]>([]);
  private promotions$ = new BehaviorSubject<Promotion[]>([]);
  private users$ = new BehaviorSubject<User[]>([]);
  private orders$ = new BehaviorSubject<Order[]>([]);

  // Restaurants
  getRestaurants(): Observable<Restaurant[]> { return this.restaurants$.asObservable(); }
  addRestaurant(r: Omit<Restaurant, 'id'>) {
    const current = this.restaurants$.value;
    const nextId = this.generateNextId(current);
    const newRestaurant: Restaurant = { ...r, id: nextId };
    this.restaurants$.next([...current, newRestaurant]);
  }
  updateRestaurant(r: Restaurant) { this.restaurants$.next(this.restaurants$.value.map(x => x.id === r.id ? r : x)); }
  deleteRestaurant(id: string) { this.restaurants$.next(this.restaurants$.value.filter(x => x.id !== id)); }

  // Dishes
  getDishes(): Observable<Dish[]> { return this.dishes$.asObservable(); }
  addDish(d: Omit<Dish, 'id'>) {
    const current = this.dishes$.value;
    const nextId = this.generateNextId(current);
    const newDish: Dish = { ...d, id: nextId };
    this.dishes$.next([...current, newDish]);
  }
  updateDish(d: Dish) { this.dishes$.next(this.dishes$.value.map(x => x.id === d.id ? d : x)); }
  deleteDish(id: string) { this.dishes$.next(this.dishes$.value.filter(x => x.id !== id)); }

  // Promotions
  getPromotions(): Observable<Promotion[]> { return this.promotions$.asObservable(); }
  addPromotion(p: Promotion) { this.promotions$.next([...this.promotions$.value, p]); }
  updatePromotion(newPromo: Promotion, oldDishId: string) {
    this.promotions$.next(
      this.promotions$.value.map(x =>
        x.dish_id === oldDishId ? newPromo : x
      )
    );
  }
  deletePromotion(dish_id: string) {
    this.promotions$.next(
      this.promotions$.value.filter(x => x.dish_id !== dish_id)
    );
  }

  // Users
  getUsers(): Observable<User[]> { return this.users$.asObservable(); }
  addUser(u: Omit<User, 'id'>) {
    const current = this.users$.value;
    const nextId = this.generateNextId(current);
    const newUser: User = { ...u, id: nextId };
    this.users$.next([...current, newUser]);
  }
  updateUser(u: User) { this.users$.next(this.users$.value.map(x => x.id === u.id ? u : x)); }
  deleteUser(id: string) { this.users$.next(this.users$.value.filter(x => x.id !== id)); }

  // Orders
  getOrders(): Observable<Order[]> { return this.orders$.asObservable(); }
  addOrder(o: Omit<Order, 'id'>) {
    const current = this.orders$.value;
    const nextId = this.generateNextId(current);
    const newOrder: Order = { ...o, id: nextId };
    this.orders$.next([...current, newOrder]);
  }
  updateOrder(o: Order) { this.orders$.next(this.orders$.value.map(x => x.id === o.id ? o : x)); }
  deleteOrder(id: string) { this.orders$.next(this.orders$.value.filter(x => x.id !== id)); }

  constructor() {
    // Dummy promotions
    const promotions: Promotion[] = [
      { dish_id: '1', special_price: 18 },
      { dish_id: '3', special_price: 14.4 }
    ];
    this.promotions$.next(promotions);

    // Dummy restaurants
    const restaurants: Restaurant[] = [
      { id: '1', name: 'Pizza Place', city: 'Warszawa', address: 'Main St 1', opening_hours: '10:00-22:00', special_offers: ['1'] },
      { id: '2', name: 'Burger Town', city: 'Kraków', address: 'High St 5', opening_hours: '11:00-23:00', special_offers: ['2'] }
    ];
    this.restaurants$.next(restaurants);

    // Dummy users
    const users: User[] = [
      { id: '1', email: 'alice@example.com', role: 'customer', points: 50, special_offers: ['1'] },
      { id: '2', email: 'bob@example.com', role: 'worker', restaurant_id: '1', points: 80, special_offers: [] },
      { id: '3', email: 'carol@example.com', role: 'worker', restaurant_id: '2', points: 30, special_offers: ['2'] }
    ];
    this.users$.next(users);

    // Dummy dishes
    const dishes: Dish[] = [
      { id: '1', name: 'Margherita', description: 'Klasyczna pizza', ingredients: 'ser, sos pomidorowy, bazylia', price: 20, points: 10 },
      { id: '2', name: 'Pepperoni', description: 'Pizza z pepperoni', ingredients: 'ser, sos pomidorowy, pepperoni', price: 25, points: 12 },
      { id: '3', name: 'Cheeseburger', description: 'Burger z cheddarem', ingredients: 'wołowina, cheddar, bułka', price: 18, points: 8 },
      { id: '4', name: 'Vegan Burger', description: 'Roślinny burger', ingredients: 'kotlet roślinny, warzywa, bułka', price: 20, points: 9 }
    ];
    this.dishes$.next(dishes);

    // Dummy orders
    const orders: Order[] = [
      {
        id: '1',
        user_id: '1',
        restaurant_id: '1',
        order_items: { '1': 1, '2': 2 },
        total_price: 43,
        total_price_including_special_offers: 43,
        status: 'checkout',
        points_used: 0,
        points_gained: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        payment_method: 'cash'
      }
    ];
    this.orders$.next(orders);
  }

  private generateNextId<T extends { id: string }>(items: T[]): string {
    if (items.length === 0) return '1';
    const maxId = Math.max(...items.map(i => Number(i.id) || 0));
    return (maxId + 1).toString();
  }
}