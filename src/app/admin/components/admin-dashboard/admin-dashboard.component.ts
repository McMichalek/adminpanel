import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // dostosuj ścieżkę, jeśli różni się w Twoim projekcie

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
