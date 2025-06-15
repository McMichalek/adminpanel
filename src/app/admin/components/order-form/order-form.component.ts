import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { Order } from '../../../models/order.model';
import { Dish } from '../../../models/dish.model';
import { User } from '../../../models/user.model';
import { Restaurant } from '../../../models/restaurant.model';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Promotion } from '../../../models/promotion.model';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {
  form!: FormGroup;
  editId?: string;

  users$!: Observable<User[]>;
  restaurants$!: Observable<Restaurant[]>;
  allDishes: Dish[] = [];
  filteredDishes: Dish[] = [];
  allPromotions: Promotion[] = [];

  totalPrice: number = 0;
  orderItems: { [dishId: string]: number } = {};

  constructor(
    private fb: FormBuilder,
    private admin: AdminService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      user_id: [null, Validators.required],
      restaurant_id: [null, Validators.required],
      selectedDishId: [null],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });

    this.users$ = this.admin.getUsers();
    this.restaurants$ = this.admin.getRestaurants();
    this.admin.getDishes().subscribe(d => {
      this.allDishes = d;
      this.filteredDishes = d;
    });
    this.admin.getPromotions().subscribe(p => this.allPromotions = p);

    this.form.get('restaurant_id')?.valueChanges.subscribe(restaurantId => {
      this.filteredDishes = this.allDishes.filter(d => d.restaurant_id === restaurantId);
      this.orderItems = {};
      this.updateTotalPrice();
    });

    this.route.params.subscribe(p => {
      if (p['id']) {
        this.editId = p['id'];
        this.admin.getOrders().subscribe(orders => {
          const order = orders.find(o => o.id === this.editId);
          if (order) {
            this.form.patchValue({
              user_id: order.user_id,
              restaurant_id: order.restaurant_id
            });
            this.orderItems = { ...order.order_items };
            this.updateTotalPrice();
          }
        });
      }
    });
  }

  get dishQuantities(): { [dishId: string]: number } {
    return this.orderItems;
  }

  addDish(): void {
    const dishId = this.form.get('selectedDishId')?.value;
    const qty = this.form.get('quantity')?.value;
    if (!dishId || qty < 1) return;
    this.orderItems[dishId] = (this.orderItems[dishId] || 0) + qty;
    this.form.get('selectedDishId')?.setValue(null);
    this.form.get('quantity')?.setValue(1);
    this.updateTotalPrice();
  }

  removeDish(dishId: string): void {
    delete this.orderItems[dishId];
    this.updateTotalPrice();
  }

  updateTotalPrice(): void {
    this.totalPrice = Object.entries(this.orderItems)
      .map(([dishId, qty]) => {
        const dish = this.allDishes.find(d => d.id === dishId);
        const promo = this.allPromotions.find(p => p.dish_id === dishId);
        return dish ? (promo ? promo.special_price : dish.price) * qty : 0;
      })
      .reduce((sum, val) => sum + val, 0);
  }

  getDisplayPrice(dishId: string): number {
    const dish = this.allDishes.find(d => d.id === dishId);
    const promo = this.allPromotions.find(p => p.dish_id === dishId);
    return promo ? promo.special_price : dish?.price ?? 0;
  }

  getDishName(dishId: string): string {
    return this.allDishes.find(d => d.id === dishId)?.name || '';
  }

  save(): void {
    if (Object.keys(this.orderItems).length === 0) return;
    const order: Order = {
      ...this.form.value,
      order_items: { ...this.orderItems },
      id: this.editId ?? this.generateOrderId(),
      total_price: this.totalPrice,
      total_price_including_special_offers: this.totalPrice,
      status: 'checkout',
      points_used: 0,
      points_gained: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      payment_method: 'cash'
    };

    if (this.editId) {
      this.admin.updateOrder(order);
    } else {
      this.admin.addOrder(order);
    }

    this.router.navigate(['/admin/orders']);
  }

  private generateOrderId(): string {
    return Date.now().toString();
  }

  keys(obj: any): string[] {
    return Object.keys(obj || {});
  }
}
