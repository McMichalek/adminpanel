import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { Restaurant } from '../../../models/restaurant.model';

@Component({
  selector: 'app-restaurant-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './restaurant-form.component.html'
})
export class RestaurantFormComponent implements OnInit {
  form!: FormGroup;
  editId?: number;
  constructor(
    private fb: FormBuilder,
    private admin: AdminService,
    private route: ActivatedRoute,
    protected router: Router
  ) {}
  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      openingHours: ['', Validators.required],
      promoIds: [[]]
    });
    this.route.params.subscribe(p => {
      if (p['id']) {
        this.editId = +p['id'];
        this.admin.getRestaurants().subscribe(list => {
          const r = list.find(x => x.id === this.editId)!;
          this.form.patchValue(r);
        });
      }
    });
  }
  save() {
    const data: Restaurant = { id: this.editId || Date.now(), ...this.form.value };
    if (this.editId) this.admin.updateRestaurant(data);
    else this.admin.addRestaurant(data);
    this.router.navigate(['/admin/restaurants']);
  }
}
