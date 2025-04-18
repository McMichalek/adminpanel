import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { Promotion } from '../../../models/promotion.model';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-promotion-list',
  imports: [
    RouterLink
  ],
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
