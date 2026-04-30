import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../core/service/user.service';
import { Login } from '../../core/models/Login';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { ActivatedRoute, Router } from '@angular/router';
import { UserFormComponent } from '../user-form/user-form.component';
import { FormField } from '../../core/models/FormField';
import { AuthService } from '../../core/service/user-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MaterialModule, UserFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private authService = inject(AuthService);
  loginFields: FormField[] = [];

  ngOnInit(): void {
    
    this.loginFields = [
      { name: 'login', label: 'Login', type: 'text', validators: [Validators.required] },
      { name: 'password', label: 'Password', type: 'password', validators: [Validators.required] }
    ];
  }

  onSubmit(formData: any): void {
    
    if (!formData) {
      return;
    }
    const loginUser: Login = {
      login: formData.login,
      password: formData.password
    };
    
    this.userService.login(loginUser)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.authService.setToken(response.token);
          localStorage.setItem('loggedInUser', loginUser.login);
          this.router.navigateByUrl('/admin-pannel');

        },
        error: (err) => {
          if ([400, 401, 403].includes(err.status)) {
            alert('Incorrect credentials, please try again.');
          } else {
            alert('An error occurred, please try again later.');
          }
        }
      });
  }

  onReset(): void {
  }

  onRegisterIfNotRegistered(): void {
    this.router.navigateByUrl('/register');
  }

  onBackHome(): void {
    this.router.navigateByUrl('');
  }

}
