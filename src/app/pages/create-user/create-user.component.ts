import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { UserService } from '../../core/service/user.service';
import { AddUser } from '../../core/models/AddUser';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { UserFormComponent } from '../user-form/user-form.component';
import { FormField } from '../../core/models/FormField';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, MaterialModule, UserFormComponent],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements OnInit {
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  createUserFields: FormField[] = [];

  ngOnInit(): void {
    this.createUserFields = [
      { name: 'firstName', label: 'First Name', type: 'text', validators: [Validators.required] },
      { name: 'lastName', label: 'Last Name', type: 'text', validators: [Validators.required] },
      { name: 'login', label: 'Login', type: 'text', validators: [Validators.required] },
      { name: 'password', label: 'Password', type: 'password', validators: [Validators.required] },
      {
        name: 'role',
        label: 'Role',
        type: 'select',
        validators: [Validators.required],
        options: [
          { key: 'user', value: 'USER' },
          { key: 'admin', value: 'ADMIN' }
        ]
      }
    ];
  }

  onSubmit(formData: any): void {

    if (!formData) {
      return;
    }

    const newUser: AddUser = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      login: formData.login,
      password: formData.password,
      role: formData.role
    };

    this.userService.createUser(newUser)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          alert('User created successfully!');
          this.router.navigateByUrl('admin-pannel');
        },
        error: (err) => {
          alert('Something went wrong: ' + err.message);
        }
      });
  }

  onReset(): void {
  }
}
