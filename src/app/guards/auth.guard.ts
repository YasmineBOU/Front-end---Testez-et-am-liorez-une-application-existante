import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../core/service/user-auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  
  canActivate(): boolean | UrlTree {
    console.log('AuthGuard canActivate:', this.authService.isAuthenticated());

    if (!this.authService.isAuthenticated()) {
      alert('You must be logged in to access the platflorm.');
      return this.router.createUrlTree(['/login']);
    }
    // Any user, redirect to book references page
    if (!this.authService.isAdmin()) {
      return this.router.createUrlTree(['/book-references']);
    }
    
    // Admin user, allow access to admin pages
    return true;
  }

  canActivateChild(): boolean | UrlTree {
    if (!this.authService.isAdmin()) {
      return this.router.createUrlTree(['/login']);
    }
    return true;
  }
}
