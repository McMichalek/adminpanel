import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { Promotion } from '../../../models/promotion.model';
import {CommonModule} from '@angular/common';
import {Observable} from 'rxjs';
import {Dish} from '../../../models/dish.model';
import {Restaurant} from '../../../models/restaurant.model';

@Component({
  selector: 'app-promotion-form',
  standalone: true,

  imports: [CommonModule, RouterModule,ReactiveFormsModule],

  templateUrl: './promotion-form.component.html'
})
export class PromotionFormComponent implements OnInit {
  form!: FormGroup;
  editId?: number;

  constructor(
    private fb: FormBuilder,
    private admin: AdminService,
    private route: ActivatedRoute,
    protected router: Router
  ) {}
  dishes$!: Observable<Dish[]>;
  restaurants$!: Observable<Restaurant[]>;
  filteredDishes: Dish[] = [];
  allDishes: Dish[] = [];
  ngOnInit(): void {
    this.restaurants$ = this.admin.getRestaurants();
    this.dishes$ = this.admin.getDishes();

    this.dishes$.subscribe(dishes => {
      this.allDishes = dishes;
    });
    this.form = this.fb.group({
      restaurantId: [null, Validators.required],
      dishId: [null, Validators.required],

      newPrice: [0, [Validators.required, Validators.min(0.01)]],
      title: ['', Validators.required],
      description: ['', Validators.required],
      discountPercentage: [0, [Validators.required, Validators.min(1), Validators.max(100)]],
      active: [true]
    });
    this.form.get('restaurantId')?.valueChanges.subscribe(restId => {
      this.filteredDishes = this.allDishes.filter(d => d.restaurantId === +restId);
      this.form.get('dishId')?.setValue(null);
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.editId = +params['id'];
        this.admin.getPromotions().subscribe(promos => {
          const promo = promos.find(p => p.id === this.editId);
          if (promo) {
            this.form.patchValue(promo);
          }
        });
      }
    });
  }

  save(): void {
    const data: Promotion = { id: this.editId || Date.now(), ...this.form.value };
    if (this.editId) {
      this.admin.updatePromotion(data);
    } else {
      this.admin.addPromotion(data);
    }
    this.router.navigate(['/admin/promotions']);
  }
}
