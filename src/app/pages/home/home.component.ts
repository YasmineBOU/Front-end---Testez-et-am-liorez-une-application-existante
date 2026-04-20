import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private router: Router) {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('authToken');
  }

  onRegister(): void {
    this.router.navigateByUrl('register');
  }

  onLogin(): void {
    this.router.navigateByUrl('login');
  }
}
