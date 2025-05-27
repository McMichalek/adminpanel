import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Restaurant } from '../../models/restaurant.model';
import { Dish } from '../../models/dish.model';
import { Promotion } from '../../models/promotion.model';
import { User } from '../../models/user.model';
import { Order } from '../../models/order.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private restaurants$ = new BehaviorSubject<Restaurant[]>([]);
  private dishes$ = new BehaviorSubject<Dish[]>([]);
  private promotions$ = new BehaviorSubject<Promotion[]>([]);
  private users$ = new BehaviorSubject<User[]>([]);
  private orders$ = new BehaviorSubject<Order[]>([]);

  constructor(private authService: AuthService) {
    // Mockowe dane startowe:
    this.promotions$.next([
      { dishId: '1', name: '10% Off', specialPrice: 18 },
      { dishId: '3', name: '20% Off', specialPrice: 14.4 }
    ]);

    this.restaurants$.next([
      { id: '1', name: 'Pizza Place', city: 'Warszawa', address: 'Main St 1', openingHours: '10:00-22:00', specialOffers: ['1'] },
      { id: '2', name: 'Burger Town', city: 'Kraków', address: 'High St 5', openingHours: '11:00-23:00', specialOffers: ['2'] }
    ]);

    this.users$.next([
      { id: '1', email: 'alice@example.com', role: 'customer', points: 50, specialOffers: ['1'] },
      { id: '2', email: 'bob@example.com', role: 'worker', restaurantId: '1', points: 80, specialOffers: [] },
      { id: '3', email: 'carol@example.com', role: 'worker', restaurantId: '2', points: 30, specialOffers: ['2'] }
    ]);

    this.dishes$.next([
      { id: '1', name: 'Margherita', description: 'Klasyczna pizza', ingredients: 'ser, sos pomidorowy, bazylia', price: 20, points: 10 },
      { id: '2', name: 'Pepperoni', description: 'Pizza z pepperoni', ingredients: 'ser, sos pomidorowy, pepperoni', price: 25, points: 12 },
      { id: '3', name: 'Cheeseburger', description: 'Burger z cheddarem', ingredients: 'wołowina, cheddar, bułka', price: 18, points: 8 },
      { id: '4', name: 'Vegan Burger', description: 'Roślinny burger', ingredients: 'kotlet roślinny, warzywa, bułka', price: 20, points: 9 }
    ]);

    this.orders$.next([
      {
        id: '1',
        userId: '1',
        restaurantId: '1',
        orderItems: { '1': 1, '2': 2 },
        totalPrice: 43,
        totalPriceIncludingSpecialOffers: 43,
        status: 'checkout',
        pointsUsed: 0,
        pointsGained: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentMethod: 'cash'
      }
    ]);
  }

  // === MOCK === tylko restauracja użytkownika
  getRestaurants(): Observable<Restaurant[]> {
    const restId = this.authService.getRestaurantId();
    return this.restaurants$.asObservable().pipe(
      map(rests => rests.filter(r => r.id === restId))
    );
  }

    // === FIREBASE === (Firestore)
    // return collectionData(query(collection(db, 'restaurants'), where('id', '==', restId)))


  getDishes(): Observable<Dish[]> {
    const restId = this.authService.getRestaurantId();
    const restaurant = this.restaurants$.value.find(r => r.id === restId);
    const allowedDishIds = restaurant?.specialOffers || [];
    return this.dishes$.asObservable().pipe(
      map(list => list.filter(d => allowedDishIds.includes(d.id)))
    );

    // === FIREBASE === (Firestore)
    // return collectionData(query(collection(db, 'dishes'), where('restaurant_id', '==', restId)))
  }

  getPromotions(): Observable<Promotion[]> {
    const restId = this.authService.getRestaurantId();
    const restaurant = this.restaurants$.value.find(r => r.id === restId);
    const allowedDishIds = restaurant?.specialOffers || [];
    return this.promotions$.asObservable().pipe(
      map(list => list.filter(p => allowedDishIds.includes(p.dishId)))
    );

    // === FIREBASE ===
    // return collectionData(query(collection(db, 'promotions'), where('restaurant_id', '==', restId)))
  }

  getOrders(): Observable<Order[]> {
    const restId = this.authService.getRestaurantId();
    return this.orders$.asObservable().pipe(
      map(list => list.filter(o => o.restaurantId === restId))
    );

    // === FIREBASE ===
    // return collectionData(query(collection(db, 'orders'), where('restaurantId', '==', restId)))
  }

  getUsers(): Observable<User[]> {
    const restId = this.authService.getRestaurantId();
    return this.users$.asObservable().pipe(
      map(list => {
        if (this.authService.getRole() === 'admin') {
          return list.filter(u => u.restaurantId === restId || u.role === 'customer');
        } else if (this.authService.getRole() === 'worker') {
          return list.filter(u => u.restaurantId === restId);
        }
        return [];
      })
    );
  }
  //FIREBASE
  // getUsers(): Observable<User[]> {
  //   const restId = this.authService.getRestaurantId();
  //   const role = this.authService.getRole();
  //
  //   const usersCollection = collection(this.firestore, 'users');
  //
  //   let q;
  //
  //   if (role === 'admin') {
  //     // Admin widzi pracowników z tej restauracji i klientów
  //     q = query(usersCollection, where('restaurantId', '==', restId));
  //     // Klientów możesz dodać osobno, lub dodać osobną sekcję jeśli potrzebujesz
  //   } else if (role === 'worker') {
  //     q = query(usersCollection, where('restaurantId', '==', restId));
  //   } else {
  //     // Inne role – brak dostępu
  //     return of([]);
  //   }
  //
  //   return collectionData(q, { idField: 'id' }) as Observable<User[]>;
  // }

  // --- ADD / UPDATE / DELETE (pozostają bez zmian) ---
  //firebase
//   constructor(private firestore: Firestore, private authService: AuthService) {}
//
//   async addRestaurant(r: Omit<Restaurant, 'id'>): Promise<void> {
//     const userId = this.authService.getUserId();
//     if (!userId) throw new Error('Użytkownik nie jest zalogowany.');
//
//     // 1. Dodaj restaurację do kolekcji
//     const docRef = await addDoc(collection(this.firestore, 'restaurants'), r);
//     const newRestaurantId = docRef.id;
//
//     // 2. Zaktualizuj użytkownika – przypisz restaurantId
//     const userRef = doc(this.firestore, 'users', userId);
//     await updateDoc(userRef, { restaurantId: newRestaurantId });
//   }
// }
  addRestaurant(r: Omit<Restaurant, 'id'>) {
    const currentRestaurants = this.restaurants$.value;
    const currentUsers = this.users$.value;

    const nextId = this.generateNextId(currentRestaurants);
    const newRestaurant: Restaurant = { ...r, id: nextId };

    // 1. Dodaj restaurację
    this.restaurants$.next([...currentRestaurants, newRestaurant]);

    // 2. Przypisz restaurantId użytkownikowi (adminowi)
    const userId = this.authService.getUserId();
    if (!userId) return;

    const updatedUsers = currentUsers.map(user =>
      user.id === userId ? { ...user, restaurantId: nextId } : user
    );

    this.users$.next(updatedUsers);
  }

  updateRestaurant(r: Restaurant) {
    this.restaurants$.next(this.restaurants$.value.map(x => x.id === r.id ? r : x));
  }

  deleteRestaurant(id: string) {
    this.restaurants$.next(this.restaurants$.value.filter(x => x.id !== id));
  }

  addDish(d: Omit<Dish, 'id'>) {
    const current = this.dishes$.value;
    const nextId = this.generateNextId(current);
    const newDish: Dish = { ...d, id: nextId };
    this.dishes$.next([...current, newDish]);
  }

  updateDish(d: Dish) {
    this.dishes$.next(this.dishes$.value.map(x => x.id === d.id ? d : x));
  }

  deleteDish(id: string) {
    this.dishes$.next(this.dishes$.value.filter(x => x.id !== id));
  }

  addPromotion(p: Promotion) {
    this.promotions$.next([...this.promotions$.value, p]);
  }

  updatePromotion(newPromo: Promotion, oldDishId: string, oldName: string) {
    this.promotions$.next(
      this.promotions$.value.map(x =>
        x.dishId === oldDishId && x.name === oldName ? newPromo : x
      )
    );
  }

  deletePromotion(dishId: string, name: string) {
    this.promotions$.next(
      this.promotions$.value.filter(x =>
        !(x.dishId === dishId && x.name === name)
      )
    );
  }

  addUser(u: Omit<User, 'id'>) {
    const current = this.users$.value;
    const nextId = this.generateNextId(current);
    const newUser: User = { ...u, id: nextId };
    this.users$.next([...current, newUser]);
  }

  updateUser(u: User) {
    this.users$.next(this.users$.value.map(x => x.id === u.id ? u : x));
  }

  deleteUser(id: string) {
    this.users$.next(this.users$.value.filter(x => x.id !== id));
  }

  addOrder(o: Omit<Order, 'id'>) {
    const current = this.orders$.value;
    const nextId = this.generateNextId(current);
    const newOrder: Order = { ...o, id: nextId };
    this.orders$.next([...current, newOrder]);
  }

  updateOrder(o: Order) {
    this.orders$.next(this.orders$.value.map(x => x.id === o.id ? o : x));
  }

  deleteOrder(id: string) {
    this.orders$.next(this.orders$.value.filter(x => x.id !== id));
  }

  private generateNextId<T extends { id: string }>(items: T[]): string {
    if (items.length === 0) return '1';
    const maxId = Math.max(...items.map(i => Number(i.id) || 0));
    return (maxId + 1).toString();
  }
}
