import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { UserService } from '../../core/service/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { UserFormComponent } from '../user-form/user-form.component';
import { FormField } from '../../core/models/FormField';
import { AddUser } from '../../core/models/AddUser';


@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [CommonModule, MaterialModule, UserFormComponent],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent implements OnInit {
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  updateUserFields: FormField[] = [];
  userData: any = {};
  userId!: number | null;
  isLoading = true;

  constructor(private location: Location) {}


  ngOnInit(): void {
    this.updateUserFields = [
    { name: 'firstName', label: 'First Name', type: 'text', validators: [Validators.required] },
    { name: 'lastName', label: 'Last Name', type: 'text', validators: [Validators.required] },
    { name: 'login', label: 'Login', type: 'text', validators: [Validators.required] },
    { name: 'password', label: 'Password', type: 'password'},
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

    const idFromRoute = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    if (!idFromRoute) {
      alert('Invalid user id.');
      this.router.navigateByUrl('/crud/list-user');
      return;
    }

    this.userId = idFromRoute;
    this.loadUserToEdit();
  }

  private loadUserToEdit(): void {
    if (!this.userId) {
      return;
    }
    this.isLoading = true;
    this.userService.getUserById(this.userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => {
          this.userData = {
            firstName: user.firstName,
            lastName: user.lastName,
            login: user.login,
            password: '',
            role: user.role ?? ''
          };
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          alert('Unable to load user: ' + err.message);
          this.router.navigateByUrl('/crud/list-user');
        }
      });
  }

  onSubmit(formData: any): void {

    
    if (!formData || !this.userId) {
      return;
    }

    const updateUser: AddUser = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      login: formData.login,
      password: formData.password,
      role: formData.role
    };

    this.userService.updateUser(this.userId, updateUser)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          alert('User updated successfully!');
          this.router.navigateByUrl('/crud/list-user');
        },
        error: (err) => {
          alert('Something went wrong: ' + err.message);
        }
      });
  }

  onPreviousPage(): void {
    this.location.back();
  }

}
