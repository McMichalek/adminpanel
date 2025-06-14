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
  addDish(d: Omit<Dish, 'id'>) {
    const current = this.dishes$.value;

    // wybierz tylko dania dla tej samej restauracji
    const sameRestaurantDishes = current.filter(x => x.restaurantId === d.restaurantId);

    const nextId = sameRestaurantDishes.length > 0
      ? Math.max(...sameRestaurantDishes.map(x => x.id)) + 1
      : 1;

    const newDish: Dish = { ...d, id: nextId };
    this.dishes$.next([...current, newDish]);
  }
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
  addOrder(o: Omit<Order, 'id'>) {
    const current = this.orders$.value;
    const nextId = current.length > 0 ? Math.max(...current.map(x => x.id)) + 1 : 1;
    const newOrder: Order = { ...o, id: nextId };
    this.orders$.next([...current, newOrder]);
  }
  updateOrder(o: Order) { this.orders$.next(this.orders$.value.map(x => x.id === o.id ? o : x)); }
  deleteOrder(id: number) { this.orders$.next(this.orders$.value.filter(x => x.id !== id)); }

  // Stock
  getStock(): Observable<StockItem[]> { return this.stock$.asObservable(); }
  addStock(s: StockItem) { this.stock$.next([...this.stock$.value, s]); }
  updateStock(s: StockItem) { this.stock$.next(this.stock$.value.map(x => x.id === s.id ? s : x)); }
  deleteStock(id: number) { this.stock$.next(this.stock$.value.filter(x => x.id !== id)); }
  constructor() {
    // Dummy promotions
    const promotions: Promotion[] = [
      {
        id: 1,
        dishId: 1,
        restaurantId: 1,
        newPrice: 18,
        title: '10% Off',
        description: 'Save 10%',
        discountPercentage: 10,
        active: true
      },
      {
        id: 2,
        dishId: 3,
        restaurantId: 2,
        newPrice: 14.4,
        title: '20% Off',
        description: 'Save 20%',
        discountPercentage: 20,
        active: true
      }
    ];
    this.promotions$.next(promotions);

    // Dummy restaurants
    const restaurants: Restaurant[] = [
      { id: 1, name: 'Pizza Place', address: 'Main St 1', openingHours: '10:00-22:00', promoIds: [1] },
      { id: 2, name: 'Burger Town', address: 'High St 5', openingHours: '11:00-23:00', promoIds: [2] }
    ];
    this.restaurants$.next(restaurants);

    // Dummy users
    const users: User[] = [
      { id: 1, email: 'alice@example.com', name: 'Alice', password: 'pass123', role: 'customer', points: 50, promoIds: [1] },
      { id: 2, email: 'bob@example.com', name: 'Bob', password: 'bobpass', role: 'franchisee', restaurantId: 1, points: 80, promoIds: [] },
      { id: 3, email: 'carol@example.com', name: 'Carol', password: 'workerpass', role: 'worker', restaurantId: 2, points: 30, promoIds: [2] }
    ];
    this.users$.next(users);

    // Dummy dishes
    const dishes: Dish[] = [
      { id: 1, name: 'Margherita', description: 'Classic pizza', price: 20, restaurantId: 1, isAvailable: true },
      { id: 2, name: 'Pepperoni', description: 'Spicy pizza', price: 25, restaurantId: 1, isAvailable: true },
      { id: 1, name: 'Cheeseburger', description: 'With cheddar', price: 18, restaurantId: 2, isAvailable: true },
      { id: 2, name: 'Vegan Burger', description: 'Plant-based', price: 20, restaurantId: 2, isAvailable: true }
    ];
    this.dishes$.next(dishes);

    // Dummy orders
    const orders: Order[] = [
      {
        id: 1,
        userId: 1,
        restaurantId: 1,
        dishIds: [1, 2],
        price: 43, // after applying promotion: 18 + 25
        totalPrice: 43,
        status: 'Nowe',
        state: 'Nowe' as any
      }
    ];
    this.orders$.next(orders);
  }

}
