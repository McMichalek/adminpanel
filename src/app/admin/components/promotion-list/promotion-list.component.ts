import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { Promotion } from '../../../models/promotion.model';
import { Dish } from '../../../models/dish.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-promotion-list',
  templateUrl: './promotion-list.component.html',
  styleUrls: ['./promotion-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class PromotionListComponent implements OnInit {
  promotions$!: Observable<Promotion[]>;
  dishes: Dish[] = [];

  constructor(private admin: AdminService) {}

  ngOnInit(): void {
    this.promotions$ = this.admin.getPromotions();
    this.admin.getDishes().subscribe(d => this.dishes = d);
  }

  getDishName(dishId: string): string {
    return this.dishes.find(d => d.id === dishId)?.name || '—';
  }

  delete(dishId: string) {
    this.admin.deletePromotion(dishId);
  }
}