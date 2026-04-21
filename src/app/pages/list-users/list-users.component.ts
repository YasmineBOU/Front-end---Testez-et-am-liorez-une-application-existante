import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../core/service/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserBasicInfo } from '../../core/models/UserBasicInfo';

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.css'
})
export class ListUsersComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  users: UserBasicInfo[] = [];
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

  onEditUser(user: UserBasicInfo): void {
    this.router.navigate(['/crud/update-user', user['id']]);
  }

  onDeleteUser(user: UserBasicInfo): void {
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

  onViewUser(user: UserBasicInfo): void {
    this.router.navigate(['/crud/read-user', user['id']]);
  }
}
