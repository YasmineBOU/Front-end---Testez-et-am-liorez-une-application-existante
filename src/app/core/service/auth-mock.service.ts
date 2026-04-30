import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthMockService {
    setToken(token: string): void {
    }

    getToken(): string {
        return 'mock-token';
    }

    removeToken(): void {
        
    }

    isAuthenticated(): boolean {
        return true;
    }

    isAdmin(): boolean {
        return true;
    }
}
