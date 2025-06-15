import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { Dish } from '../../../models/dish.model';
import { CommonModule } from '@angular/common';
import { Restaurant } from 'src/app/models/restaurant.model';

@Component({
  selector: 'app-dish-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './dish-form.component.html',
  styleUrls: ['./dish-form.component.css']
})
export class DishFormComponent implements OnInit {
  form!: FormGroup;
  editId?: string;
  restaurants: Restaurant[] = [];

  constructor(
    private fb: FormBuilder,
    private admin: AdminService,
    private route: ActivatedRoute,
    protected router: Router
  ) {}

  ngOnInit(): void {

    this.admin.getRestaurants().subscribe(restaurants => {
      this.restaurants = restaurants;
    });


    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      ingredients: [''],
      price: [0, Validators.required],
      points: [0],
      restaurant_id: ['', Validators.required]
    });


    this.route.params.subscribe(params => {
      if (params['id']) {
        this.editId = params['id'];
        this.admin.getDishes().subscribe(dishes => {
          const dish = dishes.find(d => d.id === this.editId);
          if (dish) {
            this.form.patchValue(dish);
          }
        });
      }
    });
  }

  save(): void {
    if (this.form.invalid) return;

    const data: Dish = {
      id: this.editId ?? this.generateDishId(),
      ...this.form.value
    };

    if (this.editId) {
      this.admin.updateDish(data);
    } else {
      this.admin.addDish(data);
    }

    this.router.navigate(['/admin/dishes']);
  }

  private generateDishId(): string {
    return Date.now().toString();
  }
}
