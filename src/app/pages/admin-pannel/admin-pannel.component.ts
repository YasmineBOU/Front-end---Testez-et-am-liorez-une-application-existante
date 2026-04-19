import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-pannel',
  imports: [],
  templateUrl: './admin-pannel.component.html',
  styleUrl: './admin-pannel.component.css'
})
export class AdminPannelComponent {

  constructor(private router: Router) {}

  onListUsers(): void {
    this.router.navigateByUrl('crud/list-users');
  }

  onCreateUser(): void {
    this.router.navigateByUrl('crud/create-user');
  } 

  onUpdateUser(): void {
    this.router.navigateByUrl('crud/update-user');
  }

  onDeleteUser(): void {
    this.router.navigateByUrl('crud/delete-user');
  }
  
}
