import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-pannel',
  imports: [],
  templateUrl: './admin-pannel.component.html',
  styleUrl: './admin-pannel.component.css'
})
export class AdminPannelComponent {

  login = localStorage.getItem('loggedInUser') || 'Admin';
  constructor(private router: Router) {}

  onListUsers(): void {
    this.router.navigateByUrl('/crud/list-user');
  }

  onCreateUser(): void {
    this.router.navigateByUrl('/crud/create-user');
  } 

  onUpdateUser(): void {
    // Redirect to list users page where the admin can select a user to update
    this.router.navigateByUrl('/crud/list-user');
  }

  onDeleteUser(): void {
    // Redirect to list users page where the admin can select a user to delete
    this.router.navigateByUrl('/crud/list-user');
  }
  
}
