import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, UserCredential } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(private auth: Auth) {}

  /** Logowanie użytkownika */
  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  /** Wylogowanie użytkownika */
  logout(): Observable<void> {
    return from(signOut(this.auth));
  }
}
