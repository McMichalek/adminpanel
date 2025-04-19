import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { Dish } from '../../../models/dish.model';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-dish-form',
  standalone: true,

  imports: [CommonModule, RouterModule,ReactiveFormsModule],

  templateUrl: './dish-form.component.html'
})
export class DishFormComponent implements OnInit {
  form!: FormGroup;
  editId?: number;

  constructor(
    private fb: FormBuilder,
    private admin: AdminService,
    private route: ActivatedRoute,
    protected router: Router
  ) {}
  // @ts-ignore

  restaurants$!: Observable<Restaurant[]>;
  ngOnInit(): void {
    this.restaurants$ = this.admin.getRestaurants();
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      restaurantId: [null, Validators.required],
      isAvailable: [true]
    });

    this.route.params.subscribe(p => {
      if (p['id']) {
        this.editId = +p['id'];
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
    const data: Dish = { ...this.form.value };
    if (this.editId) {
      this.admin.updateDish(data);
    } else {
      this.admin.addDish(data);
    }
    this.router.navigate(['/admin/dishes']);
  }
}
