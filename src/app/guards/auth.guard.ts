import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../core/service/user-auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  
  canActivate(): boolean | UrlTree {
    console.log('AuthGuard canActivate:', this.authService.isAuthenticated());

    if (!this.authService.isAuthenticated()) {
      alert('You must be logged with an admin account to access this page.');
      console.log('User is not authenticated, redirecting to another page.');
      return this.router.createUrlTree(['/login']);
    }

    if (!this.authService.isAdmin()) {
      // alert('Admin access only. Redirecting to book references page.');
      return this.router.createUrlTree(['/book-references']);
    }

    console.log('User is authenticated and admin, allowing access to route.');
    return true;
  }
//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): boolean | UrlTree {
//     console.log('AuthGuard canActivate:', this.authService.isAuthenticated());
    
//     if (this.authService.isAuthenticated()) {
//       return true;
//     } else {
//       return this.router.createUrlTree(['/login'], {
//         queryParams: { returnUrl: state.url }
//       });
//     }
//   }
}
