import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { Promotion } from '../../../models/promotion.model';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Dish } from '../../../models/dish.model';
import { Restaurant } from '../../../models/restaurant.model';

@Component({
  selector: 'app-promotion-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './promotion-form.component.html',
  styleUrls: ['./promotion-form.component.css'],
})
export class PromotionFormComponent implements OnInit {
  form!: FormGroup;
  editId?: string;
  editPromotion?: Promotion;
  editOldDishId?: string;

  allDishes: Dish[] = [];
  filteredDishes: Dish[] = [];
  restaurants$!: Observable<Restaurant[]>;

  constructor(
    private fb: FormBuilder,
    private admin: AdminService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.restaurants$ = this.admin.getRestaurants();

    this.admin.getDishes().subscribe(dishes => {
      this.allDishes = dishes;
    });

    this.form = this.fb.group({
      restaurant_id: [null, Validators.required],
      dish_id: [null],
      applyToAll: [false],
      discountPercentage: [0, [Validators.min(1), Validators.max(100)]],
      special_price: [null] // używane tylko w trybie pojedynczym
    });

    this.form.get('restaurant_id')?.valueChanges.subscribe(restId => {
      this.filteredDishes = this.allDishes.filter(d => d.restaurant_id === restId);
      this.form.get('dish_id')?.setValue(null);
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.editId = params['id'];
        this.admin.getPromotions().subscribe(promos => {
          const promo = promos.find(p => p.dish_id === params['id']);
          if (promo) {
            this.editPromotion = promo;
            this.editOldDishId = promo.dish_id;
            this.form.patchValue(promo);
          }
        });
      }
    });
  }

  save(): void {
    const { applyToAll, restaurant_id, dish_id, special_price, discountPercentage } = this.form.value;

    if (applyToAll && restaurant_id && discountPercentage > 0) {
      const dishes = this.allDishes.filter(d => d.restaurant_id === restaurant_id);
      dishes.forEach(d => {
        const discountedPrice = +(d.price * (1 - discountPercentage / 100)).toFixed(2);
        const promo: Promotion = {
          dish_id: d.id,
          name: `-${discountPercentage}% na ${d.name}`,
          special_price: discountedPrice
        };
        this.admin.addPromotion(promo);
      });
    } else {
      if (!dish_id || !special_price) return;
      const promo: Promotion = {
        dish_id,
        name: `Promocja - danie ${dish_id}`,
        special_price
      };

      if (this.editPromotion) {
        this.admin.updatePromotion(promo, this.editOldDishId ?? promo.dish_id);
      } else {
        this.admin.addPromotion(promo);
      }
    }

    this.router.navigate(['/admin/promotions']);
  }
}
