import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { Promotion } from '../../../models/promotion.model';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Dish } from '../../../models/dish.model';

@Component({
  selector: 'app-promotion-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './promotion-form.component.html',
  styleUrls: ['./promotion-form.component.css'],
})
// ...existing imports...
export class PromotionFormComponent implements OnInit {
  form!: FormGroup;
  editId?: string;
  editPromotion?: Promotion;
  editOldDishId?: string;
  allDishes: Dish[] = [];

  constructor(
    private fb: FormBuilder,
    private admin: AdminService,
    private route: ActivatedRoute,
    protected router: Router
  ) {}

  ngOnInit(): void {
    this.admin.getDishes().subscribe(dishes => {
      this.allDishes = dishes;
    });

    this.form = this.fb.group({
      dishId: [null, Validators.required],
      specialPrice: [0, [Validators.required, Validators.min(0.01)]]
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.editId = params['id'];
        this.admin.getPromotions().subscribe(promos => {
          const promo = promos.find(
            p => p.dishId === params['id']
          );
          if (promo) {
            this.editPromotion = promo;
            this.editOldDishId = promo.dishId;
            this.form.patchValue(promo);
          }
        });
      }
    });
  }

  save(): void {
    const data: Promotion = { ...this.form.value };
    if (this.editPromotion) {
      this.admin.updatePromotion(
        data,
        this.editOldDishId ?? data.dishId
      );
    } else {
      this.admin.addPromotion(data);
    }
    this.router.navigate(['/admin/promotions']);
  }
}