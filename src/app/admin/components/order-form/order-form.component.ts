import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { Order } from '../../../models/order.model';
import { Dish } from '../../../models/dish.model';
import { User } from '../../../models/user.model';
import { Restaurant } from '../../../models/restaurant.model';
import {CommonModule, CurrencyPipe} from '@angular/common';
import { Observable } from 'rxjs';
import {Promotion} from '../../../models/promotion.model';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {
  form!: FormGroup;
  editId?: number;

  users$!: Observable<User[]>;
  restaurants$!: Observable<Restaurant[]>;
  allDishes: Dish[] = [];
  filteredDishes: Dish[] = [];

  totalPrice: number = 0;

  constructor(
    private fb: FormBuilder,
    private admin: AdminService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      userId: [null, Validators.required],
      restaurantId: [null, Validators.required],
      dishIds: [[], Validators.required]
    });

    this.users$ = this.admin.getUsers();
    this.restaurants$ = this.admin.getRestaurants();
    this.admin.getDishes().subscribe(d => this.allDishes = d);
    this.admin.getPromotions().subscribe(p => this.allPromotions = p);

    this.form.get('restaurantId')?.valueChanges.subscribe(restId => {
      this.filteredDishes = this.allDishes.filter(d => d.restaurantId === +restId);
      this.form.get('dishIds')?.setValue([]); // reset
      this.updateTotalPrice();
    });

    this.form.get('dishIds')?.valueChanges.subscribe(() => {
      this.updateTotalPrice();
    });

    this.route.params.subscribe(p => {
      if (p['id']) {
        this.editId = +p['id'];
        this.admin.getOrders().subscribe(orders => {
          const order = orders.find(o => o.id === this.editId);
          if (order) {
            this.form.patchValue(order);
            const restaurantId = this.allDishes.find(d => order.dishIds.includes(d.id))?.restaurantId;
            this.form.get('restaurantId')?.setValue(restaurantId);
            this.filteredDishes = this.allDishes.filter(d => d.restaurantId === restaurantId);
            this.updateTotalPrice();
          }
        });
      }
    });
  }
  allPromotions: Promotion[] = [];
  updateTotalPrice(): void {
    const dishIds: number[] = this.form.get('dishIds')?.value || [];

    this.totalPrice = dishIds
      .map(id => this.allDishes.find(d => d.id === id)) // <- bez sprawdzania restauracji
      .filter((d): d is Dish => !!d)
      .reduce((sum, dish) => {
        const promo = this.allPromotions.find(p => p.dishId === dish.id && p.active);
        return sum + (promo ? promo.newPrice : dish.price);
      }, 0);

    console.log('Total:', this.totalPrice); // debug
  }
  getDisplayPrice(dishId: number): number {
    const dish = this.allDishes.find(d => d.id === dishId);
    const promo = this.allPromotions.find(p => p.dishId === dishId && p.active);
    return promo ? promo.newPrice : dish?.price ?? 0;
  }

  save(): void {
    const order: Order = {
      ...this.form.value,
      id: this.editId ?? this.generateOrderId(),
      price: this.totalPrice,
      totalPrice: this.totalPrice,
      state: 'Nowe' as any, // use actual enum if available
      status: 'Nowe'
    };

    if (this.editId) {
      this.admin.updateOrder(order);
    } else {
      this.admin.addOrder(order);
    }

    this.router.navigate(['/admin/orders']);
  }

  private generateOrderId(): number {
    const orders = this.admin['orders$'].getValue();
    return orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
  }
}
