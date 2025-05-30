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
      const role = this.authService.getRole();

      if (role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.errorMessage = 'Tylko administrator ma dostęp do panelu.';
        await this.authService.logout();
      }
    } catch (error: any) {
      this.errorMessage = 'Błąd logowania: ' + (error.message || 'Nieznany błąd');
    }
  }
}

  // INNE ----------------------------------------------------------------
  // async onLogin() {
  //   try {
  //     await this.authService.login(this.email, this.password);
  //     const role = this.authService.getRole();
  //
  //     if (role === 'admin') {
  //       this.router.navigate(['/admin/restaurants']);
  //     } else {
  //       this.errorMessage = 'Tylko administrator ma dostęp do panelu.';
  //       await this.authService.logout();
  //     }
  //   } catch (error: any) {
  //     this.errorMessage = 'Błąd logowania: ' + (error.message || 'Nieznany błąd');
  //   }
  // }
// }


//
// import { Component } from '@angular/core';
// import {FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule} from '@angular/forms';
// import { LoginService } from '../../services/login.service';
// import {CommonModule} from '@angular/common';
// import { Router } from '@angular/router';
//
// @Component({
//   imports: [CommonModule, FormsModule, ReactiveFormsModule],
//   selector: 'app-login',
//   templateUrl: 'login.component.html',
//   standalone: true,
//   styleUrls: ['login.component.css']
// })
// export class LoginComponent {
//   loginForm: FormGroup;
//   errorMessage: string | null = null;
//
//   constructor(
//     private fb: FormBuilder,
//     private loginService: LoginService,
//     private router: Router
//   ) {
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', Validators.required]
//     });
//   }
//
//   onSubmit(): void {
//     if (this.loginForm.invalid) return;
//
//     const { email, password } = this.loginForm.value;
//     this.loginService.login(email, password).subscribe({
//       next: () => {
//         this.router.navigate(['admin']);
//       },
//       error: err => {
//         this.errorMessage = err.message;
//       }
//     });
//   }
// }

