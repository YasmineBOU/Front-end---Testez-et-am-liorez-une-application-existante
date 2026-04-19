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
    
    if (this.authService.isAuthenticated()) {
        console.log('User is authenticated, allowing access to route.');
        return true;
    } else {
        console.log('User is not authenticated, redirecting to login page.');
        return this.router.createUrlTree(['/login']);
    }
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
