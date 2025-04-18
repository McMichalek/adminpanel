import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { StockItem } from '../../../models/stock-item.model';
import {RouterLink, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-stock-list',
  standalone: true,

  imports: [CommonModule, RouterModule,RouterLink],

  templateUrl: './stock-list.component.html'
})
export class StockListComponent implements OnInit {
  stock$!: Observable<StockItem[]>;

  constructor(private admin: AdminService) {}

  ngOnInit(): void {
    this.stock$ = this.admin.getStock();
  }

  delete(id: number): void {
    this.admin.deleteStock(id);
  }
}
