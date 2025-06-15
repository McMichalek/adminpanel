//firebase
// import { Injectable } from '@angular/core';
// import {
//   Auth,
//   signInWithEmailAndPassword,
//   signOut,
//   onAuthStateChanged,
//   getIdTokenResult,
//   User
// } from '@angular/fire/auth';
// import { BehaviorSubject } from 'rxjs';
//
// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   private userSubject = new BehaviorSubject<User | null>(null);
//   user$ = this.userSubject.asObservable();
//
//   private role: string | null = null;
//   private restaurantId: string | null = null;
//   private userId: string | null = null;
//
//   constructor(private auth: Auth) {
//     onAuthStateChanged(this.auth, async (user) => {
//       this.userSubject.next(user);
//
//       if (user) {
//         const token = await getIdTokenResult(user);
//         this.role = token.claims['role'] as string || null;
//         this.restaurantId = token.claims['restaurant_id'] as string || null;
//         this.userId = user.uid;
//       } else {
//         this.role = null;
//         this.restaurantId = null;
//         this.userId = null;
//       }
//     });
//   }
//
//   login(email: string, password: string) {
//     return signInWithEmailAndPassword(this.auth, email, password);
//   }
//
//   logout() {
//     this.role = null;
//     this.restaurantId = null;
//     this.userId = null;
//     return signOut(this.auth);
//   }
//
//   getRole(): string | null {
//     return this.role;
//   }
//
//   getRestaurantId(): string | null {
//     return this.restaurantId;
//   }
//
//   getUserId(): string | null {
//     return this.userId;
//   }
// }

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// @ts-ignore
import { User } from 'src/app/models/user.model.ts';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private roleSubject = new BehaviorSubject<string | null>(null);
  restaurantIdSubject = new BehaviorSubject<string[] | null>(null);
  private userIdSubject = new BehaviorSubject<string | null>(null); // ⬅️ nowość

  role$ = this.roleSubject.asObservable();
  restaurantId$ = this.restaurantIdSubject.asObservable();
  userId$ = this.userIdSubject.asObservable();

  // tylko dla testów
  login(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const users = [
        { email: 'admin1@test.com', password: 'admin123', role: 'admin', userId: 'admin-1', restaurantIds: ['1'] },
        { email: 'admin2@test.com', password: 'admin123', role: 'admin', userId: 'admin-2', restaurantIds: ['2'] },
        { email: 'admin3@test.com', password: 'admin123', role: 'admin', userId: 'admin-3', restaurantIds: ['3'] },

        { email: 'worker1@test.com', password: 'worker123', role: 'worker', userId: 'worker-1', restaurantIds: ['1'] },
        { email: 'worker2@test.com', password: 'worker123', role: 'worker', userId: 'worker-2', restaurantIds: ['2'] },
        { email: 'worker3@test.com', password: 'worker123', role: 'worker', userId: 'worker-3', restaurantIds: ['3'] },
      ];

      const found = users.find(u => u.email === email && u.password === password);

      if (found) {
        this.roleSubject.next(found.role);
        this.restaurantIdSubject.next(found.restaurantIds);
        this.userIdSubject.next(found.userId);
        resolve();
      } else {
        reject(new Error('Niepoprawne dane logowania'));
      }
    });
  }


  logout(): Promise<void> {
    this.roleSubject.next(null);
    this.restaurantIdSubject.next(null);
    this.userIdSubject.next(null);
    return Promise.resolve();
  }

  getRole(): string | null {
    return this.roleSubject.value;
  }

  getRestaurantId(): string[] | null {
    return this.restaurantIdSubject.value;
  }

  getUserId(): string | null {
    return this.userIdSubject.value;
  }
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  setCurrentUser(user: User) {
    this.currentUserSubject.next(user);
  }
  setRestaurantId(id: string | null) {
    this.restaurantIdSubject.next(id ? [id] : null);
  }

  setRestaurantIds(ids: string[] | null) {
    this.restaurantIdSubject.next(ids);
  }
}

