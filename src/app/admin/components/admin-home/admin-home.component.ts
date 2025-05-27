import { Component } from '@angular/core';
import {Router, RouterModule, RouterOutlet} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {CommonModule} from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-admin-home',
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/admin/login']);
    });
  }
}
