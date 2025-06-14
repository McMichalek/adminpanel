import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';
import { StockItem } from '../../../models/stock-item.model';
import { Dish } from '../../../models/dish.model';
import { Restaurant } from '../../../models/restaurant.model';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-stock-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './stock-form.component.html',
  styleUrls: ['./stock-form.component.css']
})
export class StockFormComponent implements OnInit {
  form!: FormGroup;
  editId?: number;

  dishes$!: Observable<Dish[]>;
  restaurants$!: Observable<Restaurant[]>;
  filteredDishes$!: Observable<Dish[]>;

  constructor(
    private fb: FormBuilder,
    private admin: AdminService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.restaurants$ = this.admin.getRestaurants();
    this.dishes$ = this.admin.getDishes();
    this.filteredDishes$ = of([]); // domyślnie pusta lista

    this.form = this.fb.group({
      restaurantId: [null, Validators.required],
      dishId: [null, Validators.required],
      name: ['', Validators.required],
      unit: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]]
    });

    this.form.get('restaurantId')?.valueChanges.subscribe(restaurantId => {
      this.filteredDishes$ = this.dishes$.pipe(
        map(dishes => dishes.filter(d => d.restaurantId === +restaurantId))
      );
      this.form.get('dishId')?.setValue(null);
    });

    this.route.params.subscribe(p => {
      if (p['id']) {
        this.editId = +p['id'];
        this.admin.getStock().subscribe(stock => {
          const item = stock.find(s => s.id === this.editId);
          if (item) {
            this.form.patchValue(item);
            this.form.get('restaurantId')?.setValue(item.restaurantId);
          }
        });
      }
    });
  }
  private generateStockItemId(): number {
    const stock = this.admin['stock$']?.getValue?.() || [];
    return stock.length > 0 ? Math.max(...stock.map(s => s.id)) + 1 : 1;
  }
  save(): void {
    const item: StockItem = {
      id: this.editId ?? this.generateStockItemId(),
      ...this.form.value
    };

    if (this.editId) {
      this.admin.updateStock(item);
    } else {
      this.admin.addStock(item);
    }

    this.router.navigate(['/admin/stock']);
  }
}
