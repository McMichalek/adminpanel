import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { Promotion } from '../../../models/promotion.model';
import {RouterLink, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-promotion-list',
  standalone: true,

  imports: [CommonModule, RouterModule,RouterLink],
  templateUrl: './promotion-list.component.html'
})
export class PromotionListComponent implements OnInit {
  promotions$!: Observable<Promotion[]>;

  constructor(private admin: AdminService) {}

  ngOnInit(): void {
    this.promotions$ = this.admin.getPromotions();
  }

  delete(id: number): void {
    this.admin.deletePromotion(id);
  }
}
