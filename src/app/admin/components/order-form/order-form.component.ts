import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { Order } from '../../../models/order.model';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-order-form',
  standalone: true,

  imports: [CommonModule, RouterModule,ReactiveFormsModule],

  templateUrl: './order-form.component.html'
})
export class OrderFormComponent implements OnInit {
  form!: FormGroup;
  editId?: number;

  constructor(
    private fb: FormBuilder,
    private admin: AdminService,
    private route: ActivatedRoute,
    protected router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      userId: [null, Validators.required],
      dishIds: [[], Validators.required],
      totalPrice: [0, [Validators.required, Validators.min(0)]],
      status: ['', Validators.required]
    });

    this.route.params.subscribe(p => {
      if (p['id']) {
        this.editId = +p['id'];
        this.admin.getOrders().subscribe(orders => {
          const order = orders.find(o => o.id === this.editId);
          if (order) {
            this.form.patchValue(order);
          }
        });
      }
    });
  }

  save(): void {
    const data: Order = { id: this.editId || Date.now(), ...this.form.value };
    if (this.editId) {
      this.admin.updateOrder(data);
    } else {
      this.admin.addOrder(data);
    }
    this.router.navigate(['/admin/orders']);
  }
}
