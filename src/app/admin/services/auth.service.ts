import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getIdTokenResult,
  User
} from '@angular/fire/auth';
import { AppCheck, getToken, AppCheckTokenResult } from '@angular/fire/app-check';
import { BehaviorSubject } from 'rxjs';

export interface UserTokens {
  /** ID Token Firebase Authentication */
  idToken: string;
  /** App Check Token */
  appCheckToken: string;
  /** UID zalogowanego użytkownika */
  uid: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  private role: string | null = null;
  private restaurantId: string | null = null;
  private userId: string | null = null;

  constructor(
    private auth: Auth,
    private appCheck: AppCheck
  ) {
    // Nasłuchiwanie zmiany stanu zalogowania
    onAuthStateChanged(this.auth, async (user) => {
      this.userSubject.next(user);

      if (user) {
        // Pobranie tokena z niestandardowymi claimami
        const tokenResult = await getIdTokenResult(user);
        this.role = (tokenResult.claims['role'] as string) || null;
        this.restaurantId = (tokenResult.claims['restaurant_id'] as string) || null;
        this.userId = user.uid;
      } else {
        this.role = null;
        this.restaurantId = null;
        this.userId = null;
      }
    });
  }

  /** Logowanie użytkownika e-mailem i hasłem */
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  /** Wylogowanie użytkownika */
  logout() {
    this.role = null;
    this.restaurantId = null;
    this.userId = null;
    return signOut(this.auth);
  }

  /** Zwraca rolę zalogowanego użytkownika (z custom claims) */
  getRole(): string | null {
    return this.role;
  }

  /** Zwraca restaurantId z custom claims */
  getRestaurantId(): string | null {
    return this.restaurantId;
  }

  /** Zwraca UID zalogowanego użytkownika */
  getUserId(): string | null {
    return this.userId;
  }

  /**
   * Pobiera jednocześnie:
   *  - ID Token (Firebase Auth),
   *  - App Check Token (Firebase App Check),
   *  - UID aktualnie zalogowanego użytkownika.
   *
   * Zwraca Promise<UserTokens>, a w razie braku zalogowanego rzuca wyjątek.
   */
  async getUserToken(): Promise<UserTokens> {
    // 1) Sprawdź, czy jest zalogowany użytkownik
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('Brak zalogowanego użytkownika'); // odpowiada Twojemu warunkowi w kodzie Dart
    }

    // 2) Pobierz ID Token (string)
    //    Możesz tu użyć user.getIdToken(), ale z importów AngularFire wygodniej jest getIdTokenResult,
    //    jeśli potrzebujesz dodatkowych informacji – tutaj jednak wyciągamy tylko token:
    const idToken = await user.getIdToken();

    // 3) Pobierz App Check Token (string)
    //    Używamy getToken(this.appCheck), false = nie wymuszaj odświeżenia,
    //    jeśli token jest wciąż ważny.
    const appCheckResult: AppCheckTokenResult = await getToken(this.appCheck, /* forceRefresh = */ false);
    const appCheckToken = appCheckResult.token;

    // 4) UID użytkownika
    const uid = user.uid;

    return {
      idToken,
      appCheckToken,
      uid
    };
  }
}
