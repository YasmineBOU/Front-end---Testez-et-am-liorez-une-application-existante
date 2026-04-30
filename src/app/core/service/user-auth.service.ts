import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey: string = 'authToken';

  constructor() {}

  
  /**
   * Sets the authentication token in localStorage.
   * 
   * @param token The authentication token to be set.
   */
  setToken(token: string): void {
    console.log('Setting token in setToken:', token);
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string {
    console.log('Getting token in getToken:', localStorage.getItem(this.tokenKey));
    return localStorage.getItem(this.tokenKey) || '';
  }

/**
 * Removes the token from localStorage.
 * 
 * This method is used to log out the user. It removes the token from localStorage, effectively logging out the user.
 */
  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  /**
   * Checks if the user is authenticated.
   * 
   * @returns {boolean} True if the user is authenticated, false otherwise.
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    return !this.isTokenExpired(token);
  }

  isAdmin(): boolean {
    const token = this.getToken();
    if (!token || this.isTokenExpired(token)) {
      return false;
    }

    const roles = this.extractRoles(token);
    // console.log('Extracted roles from token:', roles);
    return roles.includes('ROLE_ADMIN');
  }

  private extractRoles(token: string): string[] {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const rawRoles = payload?.roles;
      // console.log('Raw roles from token payload:', rawRoles); 

      if (!Array.isArray(rawRoles)) {
        return [];
      }

      return rawRoles
        .map((roleEntry: unknown) => {
          if (typeof roleEntry === 'string') {
            return roleEntry;
          }
          if (
            roleEntry &&
            typeof roleEntry === 'object' &&
            'authority' in roleEntry &&
            typeof (roleEntry as { authority: unknown }).authority === 'string'
          ) {
            return (roleEntry as { authority: string }).authority;
          }
          return '';
        })
        .filter((role): role is string => role.length > 0);
    } catch {
      return [];
    }
  }

/*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Check if the token has expired.
   * @param {string} token The token to check.

   * @returns {boolean} True if the token has expired, false otherwise.
   * @throws If the token is invalid.
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      if (!exp) {
        return true; 
      }
      const now = Math.floor(new Date().getTime() / 1000);
      return exp < now;
    } catch (e) {
      return true; // token invalide
    }
  }
}
