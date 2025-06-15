import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdminService } from '../../services/admin.service';
import { Dish } from '../../../models/dish.model';
import { Promotion } from '../../../models/promotion.model';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';

type DishWithPromo = Dish & { promoPrice?: number | null };

@Component({
  selector: 'app-dish-list',
  standalone: true,
  templateUrl: './dish-list.component.html',
  styleUrls: ['./dish-list.component.css'],
  imports: [CommonModule, RouterModule, RouterLink, CurrencyPipe]
})
export class DishListComponent implements OnInit {
  dishes$!: Observable<DishWithPromo[]>;

  constructor(private admin: AdminService) {}

  ngOnInit() {
    this.dishes$ = combineLatest([
      this.admin.getDishes(),
      this.admin.getPromotions()
    ]).pipe(
      map(([dishes, promotions]) =>
        dishes.map(dish => {
          const promo = promotions.find(p => p.dish_id === dish.id);
          return {
            ...dish,
            promoPrice: promo?.special_price ?? null
          };
        })
      )
    );
  }

  delete(id: string) {
    this.admin.deleteDish(id);
  }
}
