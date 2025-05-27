import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const role = this.authService.getRole();

    // Jeśli rola to admin, pozwól wejść
    if (role === 'admin') {
      return true;
    }

    // Jeśli nie, przekieruj np. do strony błędu
    this.router.navigate(['/unauthorized']);
    return false;
  }
}
