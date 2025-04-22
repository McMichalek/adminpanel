import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { User } from '../../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
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
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required] // Default role
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.editId = +params['id'];
        this.admin.getUsers().subscribe(users => {
          const user = users.find(u => u.id === this.editId);
          if (user) {
            this.form.patchValue(user);
          }
        });
      }
    });
  }

  save(): void {
    const data: User = {
      id: this.editId ?? this.generateUserId(),
      promoIds: [],
      ...this.form.value
    };

    if (this.editId) {
      this.admin.updateUser(data);
    } else {
      this.admin.addUser(data);
    }

    this.router.navigate(['/admin/users']);
  }

  private generateUserId(): number {
    const users = this.admin['users$']?.getValue?.() || [];
    return users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  }
}
