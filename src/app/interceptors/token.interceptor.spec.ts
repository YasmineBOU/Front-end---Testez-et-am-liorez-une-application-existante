import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpHandlerFn, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tokenInterceptor } from './token.interceptor';
import { AuthService } from '../core/service/user-auth.service';
import { runInInjectionContext } from '@angular/core';

describe('tokenInterceptor', () => {
  let authService: jest.Mocked<AuthService>;

  // Helper pour simuler HttpHandlerFn
  const createMockHttpHandler = (expectedRequest?: HttpRequest<any>): HttpHandlerFn => {
    return (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
      if (expectedRequest) {
        expect(req.url).toBe(expectedRequest.url);
        expect(req.method).toBe(expectedRequest.method);

        if (expectedRequest.headers.has('Authorization')) {
          expect(req.headers.get('Authorization')).toBe(expectedRequest.headers.get('Authorization'));
        }
      }
      return of({} as HttpEvent<any>);
    };
  };

  beforeEach(() => {
    const authServiceMock = {
      getToken: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
  });

  it('should add Authorization header if token is present', () => {
    authService.getToken.mockReturnValue('test-token-123');

    const req = new HttpRequest('GET', 'https://api.example.com/data');
    const expectedReq = new HttpRequest('GET', 'https://api.example.com/data', {
      headers: new HttpHeaders({
        'Authorization': 'Bearer test-token-123',
      }),
    });

    const next: HttpHandlerFn = createMockHttpHandler(expectedReq);

    runInInjectionContext(TestBed.inject(TestBed), () => {
      const interceptor: HttpInterceptorFn = tokenInterceptor;
      interceptor(req, next);
    });

    expect(authService.getToken).toHaveBeenCalled();
  });

  it('should not modify the request if token is not present', () => {
    authService.getToken.mockReturnValue('');

    const req = new HttpRequest('GET', 'https://api.example.com/data');
    const next: HttpHandlerFn = createMockHttpHandler(req);

    runInInjectionContext(TestBed.inject(TestBed), () => {
      const interceptor: HttpInterceptorFn = tokenInterceptor;
      interceptor(req, next);
    });

    expect(authService.getToken).toHaveBeenCalled();
  });
});
