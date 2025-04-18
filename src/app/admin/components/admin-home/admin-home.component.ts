import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-admin-home',
  imports: [RouterModule], // ✅ This is required for <a routerLink>
  templateUrl: './admin-home.component.html'
})
export class AdminHomeComponent {}
