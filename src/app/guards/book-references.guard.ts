import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../core/service/user-auth.service';
@Injectable({
  providedIn: 'root'
})
export class BookReferencesGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  
  canActivate(): boolean | UrlTree {
    console.log('BookReferencesGuard canActivate:', this.authService.isAuthenticated());

    if (!this.authService.isAuthenticated()) {
      alert('You must be logged to access this page.');
      console.log('User is not authenticated, redirecting to another page.');
      return this.router.createUrlTree(['/login']);
    }

    // Allow access as long as the user is authenticated
    return true;
  }

}
