import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../core/service/user.service';
import { Register } from '../../core/models/Register';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  users: Register[] = [];
  properties: string[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.listUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.properties = users.length > 0 ? Object.keys(users[0]) : [];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load users. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onEditUser(user: Register): void {
    this.router.navigate(['/crud/update-user', user['id']]);
  }

  onDeleteUser(user: Register): void {
    if (confirm(`Are you sure you want to delete user ${user.firstName} ${user.lastName}?`)) {
      console.log("\n\nDeleting user with id : ", user['id'], typeof user['id']);
      console.log("\n\nDeleting user : ", user);
      this.userService.deleteUser(user['id']).subscribe({
        next: () => {
          this.users = this.users.filter(u => u['id'] !== user['id']);
        }
      });
    }
  }

  onViewUser(user: Register): void {
    this.userService.viewUser(user).subscribe({
      next: () => {
        alert(`User details:\n\nFirst Name: ${user.firstName}\nLast Name: ${user.lastName}\nLogin: ${user.login}`);
      }
    });
  }
}
