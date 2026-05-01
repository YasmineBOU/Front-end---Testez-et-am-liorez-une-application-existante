import { TestBed } from '@angular/core/testing';
import { AuthService } from '../core/service/user-auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UrlTree } from '@angular/router';
import { BookReferencesGuard } from './book-references.guard';

describe('BookReferencesGuard', () => {
  let guard: BookReferencesGuard;
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
        BookReferencesGuard,
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    guard = TestBed.inject(BookReferencesGuard);
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
      expect(global.alert).toHaveBeenCalledWith('You must be logged in to access this page.');
      expect(routerSpy).toHaveBeenCalledWith(['/login']);
      expect(result).toBeInstanceOf(UrlTree);
    });

    it('should allow access if user is authenticated', () => {
      authService.isAuthenticated.mockReturnValue(true);

      const result = guard.canActivate();

      expect(authService.isAuthenticated).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
