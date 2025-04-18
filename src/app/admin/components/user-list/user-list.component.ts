import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { User } from '../../../models/user.model';
import {RouterLink, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-user-list',
  standalone: true,

  imports: [CommonModule, RouterModule,RouterLink],
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  users$!: Observable<User[]>;

  constructor(private admin: AdminService) {}

  ngOnInit(): void {
    this.users$ = this.admin.getUsers();
  }

  delete(id: number): void {
    this.admin.deleteUser(id);
  }
}
