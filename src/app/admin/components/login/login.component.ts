import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {
  }

  //FIREBASE
  async onLogin() {
    try {
      await this.authService.login(this.email, this.password);
      // const role = this.authService.getRole();
      const role = 'admin';

      if (role === 'admin') {
        this.router.navigate(['/restaurants']);
      } else {
        this.errorMessage = 'Tylko administrator ma dostęp do panelu.';
        await this.authService.logout();
      }
    } catch (error: any) {
      this.errorMessage = 'Błąd logowania: ' + (error.message || 'Nieznany błąd');
    }
  }
}

