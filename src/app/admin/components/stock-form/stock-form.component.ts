import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { StockItem } from '../../../models/stock-item.model';

@Component({
  selector: 'app-stock-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './stock-form.component.html'
})
export class StockFormComponent implements OnInit {
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
      name: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]],
      unit: ['', Validators.required],
      restaurantId: [null, Validators.required]
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.editId = +params['id'];
        this.admin.getStock().subscribe(stock => {
          const item = stock.find(s => s.id === this.editId);
          if (item) {
            this.form.patchValue(item);
          }
        });
      }
    });
  }

  save(): void {
    const data: StockItem = { id: this.editId || Date.now(), ...this.form.value };
    if (this.editId) {
      this.admin.updateStock(data);
    } else {
      this.admin.addStock(data);
    }
    this.router.navigate(['/admin/stock']);
  }
}
