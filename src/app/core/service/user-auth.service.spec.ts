import { TestBed } from '@angular/core/testing';
import { AuthService } from './user-auth.service';

describe('AuthService', () => {
  let authService: AuthService;

    const currentTime = Math.floor(new Date().getTime() / 1000);
    const offset = 1000;
    const tokenKey = 'authToken';

  beforeEach(() => {
    TestBed.configureTestingModule({});
    authService = TestBed.inject(AuthService);

    let store: Record<string, string> = {};

    const mockLocalStorage = {
      getItem: jest.fn((key: string): string | null => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        store = {};
      }),
      key: jest.fn(),
      length: 0,
    };

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('Token Management', () => {
    it('should set and get token correctly', () => {
      const token = 'test-token-123';
      authService.setToken(token);
      expect(localStorage.setItem).toHaveBeenCalledWith(tokenKey, token);
      expect(authService.getToken()).toBe(token);
    });

    it('should remove token correctly', () => {
      const token = 'test-token-123';
      authService.setToken(token);
      authService.removeToken();
      expect(localStorage.removeItem).toHaveBeenCalledWith(tokenKey);
      expect(authService.getToken()).toBe('');
    });
  });

  describe('isAuthenticated', () => {

    it('should return false if no token is present', () => {
        expect(authService.isAuthenticated()).toBe(false);
    });

    it('should return true if token is valid and not expired', () => {
        const payload = btoa(JSON.stringify({ exp: currentTime + offset, roles: ['ROLE_USER'] }));
        const token = `header.${payload}.signature`;
        localStorage.setItem(tokenKey, token);
        expect(authService.isAuthenticated()).toBe(true);
    });

    it('should return false if token is expired', () => {
        const payload = btoa(JSON.stringify({ exp: currentTime - offset, roles: ['ROLE_USER'] }));
        const expiredToken = `header.${payload}.signature`;
        localStorage.setItem(tokenKey, expiredToken);
        expect(authService.isAuthenticated()).toBe(false);
    });

    it('should return false if token is invalid', () => {
        const invalidToken = 'invalid.token.format';
        localStorage.setItem(tokenKey, invalidToken);
        expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('isAdmin', () => {

    it('should return false if no token is present', () => {
      expect(authService.isAdmin()).toBe(false);
    });

    it('should return false if token is invalid', () => {
      const invalidToken = 'invalid.token.format';
      localStorage.setItem(tokenKey, invalidToken);
      expect(authService.isAdmin()).toBe(false);
    });

    it('should return false if token is expired', () => {
      const payload = btoa(JSON.stringify({ exp: currentTime - offset, roles: ['ROLE_ADMIN'] }));
      const expiredToken = `header.${payload}.signature`;
      localStorage.setItem(tokenKey, expiredToken);
      expect(authService.isAdmin()).toBe(false);
    });

    it('should return true if user has ROLE_ADMIN', () => {
      const payload = btoa(JSON.stringify({ exp: currentTime + offset, roles: ['ROLE_ADMIN'] }));
      const token = `header.${payload}.signature`;
      localStorage.setItem(tokenKey, token);
      expect(authService.isAdmin()).toBe(true);
    });

    it('should return false if user does not have ROLE_ADMIN', () => {
      const payload = btoa(JSON.stringify({ exp: currentTime + offset, roles: ['ROLE_USER'] }));
      const token = `header.${payload}.signature`;
      localStorage.setItem(tokenKey, token);
      expect(authService.isAdmin()).toBe(false);
    });

    it('should handle roles in different formats as long as they contain ROLE_ADMIN', () => {
      const payload = btoa(JSON.stringify({
        exp: currentTime + offset,
        roles: [
          'ROLE_ADMIN',
          { authority: 'ROLE_USER' },
          { invalid: 'role' },
          123,
        ],
      }));
      const token = `header.${payload}.signature`;
      localStorage.setItem(tokenKey, token);
      expect(authService.isAdmin()).toBe(true); 
    });

    it('should return false if roles array is empty', () => {
      const payload = btoa(JSON.stringify({ exp: currentTime + offset, roles: [] }));
      const token = `header.${payload}.signature`;
      localStorage.setItem(tokenKey, token);
      expect(authService.isAdmin()).toBe(false);
    });
  });

  describe('isTokenExpired', () => {
    it('should return false if token is not expired', () => {
      const payload = btoa(JSON.stringify({ exp: currentTime + offset }));
      const token = `header.${payload}.signature`;
      expect(authService['isTokenExpired'](token)).toBe(false);
    });

    it('should return true if token is expired', () => {
      const payload = btoa(JSON.stringify({ exp: currentTime - offset }));
      const token = `header.${payload}.signature`;
      expect(authService['isTokenExpired'](token)).toBe(true);
    });

    it('should return true if token is invalid', () => {
      const invalidToken = 'invalid.token.format';
      expect(authService['isTokenExpired'](invalidToken)).toBe(true);
    });

    it('should return true if token has no exp field or any caught error', () => {
      const payload = btoa(JSON.stringify({}));
      const tokenWithoutExp = `header.${payload}.signature`;
      expect(authService['isTokenExpired'](tokenWithoutExp)).toBe(true);
    });
  });
});
