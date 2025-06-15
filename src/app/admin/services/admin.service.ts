import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, map, of, combineLatest} from 'rxjs';
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
    const now = new Date().toISOString();

    const restaurantNames = [
      { name: 'Złota Chochla', city: 'Warszawa', address: 'ul. Złota 10' },
      { name: 'Smaczna Przystań', city: 'Kraków', address: 'ul. Rynek 5' },
      { name: 'Burger Bazar', city: 'Wrocław', address: 'ul. Piastowska 7' },
      { name: 'Pasta i Basta', city: 'Gdańsk', address: 'ul. Morska 12' },
      { name: 'Kuchnia Babci Heli', city: 'Poznań', address: 'ul. Wiejska 1' }
    ];

    const restaurants: Restaurant[] = restaurantNames.map((r, i) => ({
      id: `${i + 1}`,
      name: r.name,
      city: r.city,
      address: r.address,
      openingHours: '10:00-22:00',
      specialOffers: []
    }));

    const dishNames = [
      'Pierogi Ruskie', 'Burger Wołowy', 'Pizza Capricciosa',
      'Spaghetti Carbonara', 'Schabowy z Ziemniakami', 'Sałatka Cezar',
      'Zupa Pomidorowa', 'Kebab Klasyczny', 'Placki Ziemniaczane',
      'Sushi Maki Mix', 'Naleśniki z Twarogiem', 'Wrap z Kurczakiem',
      'Leczo Wegetariańskie', 'Gulasz Węgierski', 'Tatar z Łososia'
    ];

    const dishes: Dish[] = dishNames.map((name, i) => {
      const restId = `${(i % restaurants.length) + 1}`;
      return {
        id: `${i + 1}`,
        restaurant_id: restId,
        name,
        description: `Opis: ${name}`,
        ingredients: 'składnik1, składnik2',
        price: 15 + i,
        points: i + 1
      };
    });

    const promotions: Promotion[] = dishes
      .filter((_, i) => i % 3 === 0)
      .map(d => ({
        dish_id: d.id,
        name: `${d.name} PROMO`,
        special_price: +(d.price * 0.85).toFixed(2)
      }));

    const users: User[] = [
      { id: 'w1', email: 'worker1@test.com', role: 'worker', restaurant_id: ['1'], points: 20,special_offers: []  },
      { id: 'w2', email: 'worker2@test.com', role: 'worker', restaurant_id: ['2'], points: 25,special_offers: []  },
      { id: 'w3', email: 'worker3@test.com', role: 'worker', restaurant_id: ['3'], points: 30,special_offers: []  },
      ...Array.from({ length: 5 }, (_, i) => ({
        id: `c${i + 1}`,
        email: `klient${i + 1}@mail.com`,
        role: 'customer' as const,
        points: i * 10,
        special_offers: []
      }))
    ];

    const orders: Order[] = Array.from({ length: 10 }, (_, i) => {
      const dish = dishes[i];
      const promo = promotions.find(p => p.dish_id === dish.id);
      const price = promo?.special_price ?? dish.price;
      return {
        id: `${i + 1}`,
        user_id: `c${(i % 5) + 1}`,
        restaurant_id: dish.restaurant_id,
        order_items: { [dish.id]: 1 },
        total_price: price,
        total_price_including_special_offers: price,
        status: 'checkout',
        points_used: 0,
        points_gained: 5,
        created_at: now,
        updated_at: now,
        payment_method: 'card'
      };
    });

    // Przypisz promocje do restauracji
    restaurants.forEach(r => {
      r.specialOffers = promotions
        .filter(p => dishes.find(d => d.id === p.dish_id)?.restaurant_id === r.id)
        .map(p => p.dish_id);
    });

    // Przypisanie do źródeł
    this.restaurants$.next(restaurants);
    this.dishes$.next(dishes);
    this.promotions$.next(promotions);
    this.users$.next(users);
    this.orders$.next(orders);
  }


  // === MOCK === tylko restauracja użytkownika
  getRestaurants(): Observable<Restaurant[]> {
    return combineLatest([
      this.restaurants$.asObservable(),
      this.authService.restaurantIdSubject.asObservable()
    ]).pipe(
      map(([restaurants, restIds]) => {
        console.log('restIds:', restIds);
        console.log('restaurants:', restaurants);
        const filtered = restIds ? restaurants.filter(r => restIds.includes(r.id)) : [];
        console.log('filtered:', filtered);
        return filtered;
      })
    );
  }

    // === FIREBASE === (Firestore)
    // return collectionData(query(collection(db, 'restaurants'), where('id', '==', restId)))


  getDishes(): Observable<Dish[]> {
    const restIds = this.authService.getRestaurantId();
    if (!restIds) return of([]); // brak restauracji — brak dań

    return this.dishes$.asObservable().pipe(
      map(dishes => dishes.filter(d => restIds.includes(d.restaurant_id)))
    );
  }



  getPromotions(): Observable<Promotion[]> {
    const restIds = this.authService.getRestaurantId();
    if (!restIds) return of([]); // Brak ID – brak promocji
    const allowedRestaurants = this.restaurants$.value.filter(r => restIds.includes(r.id));

    // Zbierz wszystkie ID dań objętych promocjami
    const allowedDishIds = this.dishes$.value
      .filter(d => restIds.includes(d.restaurant_id))
      .map(d => d.id);

    // Przefiltruj promocje tylko dla tych dań
    return this.promotions$.asObservable().pipe(
      map(promos => promos.filter(p => allowedDishIds.includes(p.dish_id)))
    );
  }

  getOrders(): Observable<Order[]> {
    const restIds = this.authService.getRestaurantId();
    if (!restIds) return of([]); // Brak ID – brak zamówień

    return this.orders$.asObservable().pipe(
      map(list => list.filter(o => restIds.includes(o.restaurant_id)))
    );
  }

  getUsers(): Observable<User[]> {
    const restIds = this.authService.getRestaurantId();
    const role = this.authService.getRole();

    return this.users$.asObservable().pipe(
      map(users => {
        if (!restIds) return [];

        if (role === 'admin') {
          return users.filter(user =>
            user.role === 'customer' ||
            (user.restaurant_id && user.restaurant_id.some(id => restIds.includes(id))) // pracownicy przypisani do restauracji admina
          );
        }

        if (role === 'worker') {
          return users.filter(user =>
            user.restaurant_id && user.restaurant_id.some(id => restIds.includes(id))
          );
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

    // 1. Dodaj restaurację do listy
    this.restaurants$.next([...currentRestaurants, newRestaurant]);
    console.log('Nowy stan restaurants$', this.restaurants$.value);

    // 2. Pobierz aktualnego użytkownika
    const userId = this.authService.getUserId();
    if (!userId) return;

    // 3. Zaktualizuj restaurantId u użytkownika
    const updatedUsers = currentUsers.map(user => {
      if (user.id !== userId) return user;

      const currentRestIds = user.restaurant_id ?? [];
      const newIds = [...currentRestIds, nextId];

      return {
        ...user,
        restaurantId: newIds
      };
    });

    this.users$.next(updatedUsers);

    // 4. Zaktualizuj restaurantIdSubject w authService (reaktywne źródło danych)
    const currentIds = this.authService.getRestaurantId() ?? [];
    this.authService.setRestaurantIds([...currentIds, nextId]);
    console.log('Nowe restaurantId użytkownika', this.authService.getRestaurantId());
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

  updatePromotion(newPromo: Promotion, oldDishId: string) {
    this.promotions$.next(
      this.promotions$.value.map(x =>
        x.dish_id === oldDishId ? newPromo : x
      )
    );
  }

  deletePromotion(dishId: string) {
    this.promotions$.next(
      this.promotions$.value.filter(x =>
        !(x.dish_id === dishId)
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
