import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';
import { Restaurant } from '../../../models/restaurant.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-restaurant-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.css'],
})
export class RestaurantFormComponent implements OnInit {
  form!: FormGroup;
  editId?: number;
  restaurants: Restaurant[] = [];

  constructor(
    private fb: FormBuilder,
    private admin: AdminService,
    private route: ActivatedRoute,
    public router: Router
  ) {}


  ngOnInit(): void {
    this.admin.getRestaurants().subscribe(restaurants => { // 🔧 POBIERANIE DANYCH
      this.restaurants = restaurants;
    });

    this.form = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      openingHours: ['', Validators.required]
    });

    this.route.params.subscribe(p => {
      if (p['id']) {
        this.editId = +p['id'];
        const restaurant = this.restaurants.find(r => r.id === this.editId); // 🔧 TERAZ DZIAŁA
        if (restaurant) {
          this.form.patchValue(restaurant);
        }
      }
    });
  }

  save(): void {
    const restaurant: Restaurant = {
      id: this.editId ?? this.generateRestaurantId(),
      promoIds: [],
      ...this.form.value
    };

    if (this.editId) {
      this.admin.updateRestaurant(restaurant);
    } else {
      this.admin.addRestaurant(restaurant);
    }

    this.router.navigate(['/admin/restaurants']);
  }

  private generateRestaurantId(): number {
    const restaurants = this.admin['restaurants$']?.getValue?.() || [];
    return restaurants.length > 0 ? Math.max(...restaurants.map(r => r.id)) + 1 : 1;
  }
}
