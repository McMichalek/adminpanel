import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { Promotion } from '../../../models/promotion.model';

@Component({
  selector: 'app-promotion-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './promotion-form.component.html'
})
export class PromotionFormComponent implements OnInit {
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
      title: ['', Validators.required],
      description: [''],
      discountPercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      active: [true]
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.editId = +params['id'];
        this.admin.getPromotions().subscribe(promos => {
          const promo = promos.find(p => p.id === this.editId);
          if (promo) {
            this.form.patchValue(promo);
          }
        });
      }
    });
  }

  save(): void {
    const data: Promotion = { id: this.editId || Date.now(), ...this.form.value };
    if (this.editId) {
      this.admin.updatePromotion(data);
    } else {
      this.admin.addPromotion(data);
    }
    this.router.navigate(['/admin/promotions']);
  }
}
