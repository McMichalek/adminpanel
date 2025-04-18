import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { Dish } from '../../../models/dish.model';
import {RouterLink} from '@angular/router';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-dish-list',
  imports: [
    RouterLink,
    CurrencyPipe
  ],
  templateUrl: './dish-list.component.html'
})
export class DishListComponent implements OnInit {
  dishes$!: Observable<Dish[]>;

  constructor(private admin: AdminService) {}

  ngOnInit() {
    this.dishes$ = this.admin.getDishes();
  }

  delete(id: number) {
    this.admin.deleteDish(id);
  }
}
