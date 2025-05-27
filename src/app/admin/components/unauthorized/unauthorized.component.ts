import { Component } from '@angular/core';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  template: `<h2>Brak dostępu</h2><p>Nie masz uprawnień, by wejść do tej części panelu.</p>`
})
export class UnauthorizedComponent {}
