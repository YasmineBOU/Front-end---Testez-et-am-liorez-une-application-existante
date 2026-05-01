import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../core/service/user-auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UrlTree } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jest.Mocked<AuthService>;
  let router: Router;

  beforeEach(() => {
    const authServiceMock = {
      isAuthenticated: jest.fn(),
      isAdmin: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    router = TestBed.inject(Router);
    global.alert = jest.fn(); 
  });

  describe('canActivate', () => {

    it('should redirect to "/login" if user is not authenticated', () => {
      authService.isAuthenticated.mockReturnValue(false);

      const routerSpy = jest.spyOn(router, 'createUrlTree');
      const result = guard.canActivate();

      expect(authService.isAuthenticated).toHaveBeenCalled();
      expect(global.alert).toHaveBeenCalledWith('You must be logged in to access the platflorm.');
      expect(routerSpy).toHaveBeenCalledWith(['/login']);
      expect(result).toBeInstanceOf(UrlTree);
    });
    
    it('should redirect to "/book-references" if user is authenticated but not admin', () => {
      authService.isAuthenticated.mockReturnValue(true);
      authService.isAdmin.mockReturnValue(false);

      const routerSpy = jest.spyOn(router, 'createUrlTree');
      const result = guard.canActivate();

      expect(authService.isAuthenticated).toHaveBeenCalled();
      expect(authService.isAdmin).toHaveBeenCalled();
      expect(routerSpy).toHaveBeenCalledWith(['/book-references']);
      expect(result).toBeInstanceOf(UrlTree);
    });

    it('should allow access if user is admin', () => {
      authService.isAuthenticated.mockReturnValue(true);
      authService.isAdmin.mockReturnValue(true);

      const result = guard.canActivate();

      expect(authService.isAuthenticated).toHaveBeenCalled();
      expect(authService.isAdmin).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('canActivateChild', () => {
    it('should redirect to "/login" if user is not admin', () => {
      authService.isAdmin.mockReturnValue(false);

      const routerSpy = jest.spyOn(router, 'createUrlTree');
      const result = guard.canActivateChild();

      expect(authService.isAdmin).toHaveBeenCalled();
      expect(routerSpy).toHaveBeenCalledWith(['/login']);
      expect(result).toBeInstanceOf(UrlTree);
    });

    it('should allow access if user is admin', () => {
      authService.isAdmin.mockReturnValue(true);

      const result = guard.canActivateChild();

      expect(authService.isAdmin).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
