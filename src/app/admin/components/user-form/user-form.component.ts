import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './user-form.component.html'
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
      role: ['', Validators.required]
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
    const data: User = { id: this.editId || Date.now(), ...this.form.value };
    if (this.editId) {
      this.admin.updateUser(data);
    } else {
      this.admin.addUser(data);
    }
    this.router.navigate(['/admin/users']);
  }
}
