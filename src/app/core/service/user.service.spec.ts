import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { Register } from '../models/Register';
import { Login } from '../models/Login';
import { AddUser } from '../models/AddUser';
import { UserBasicInfo } from '../models/UserBasicInfo';
import { UserDetailInfo } from '../models/UserDetailInfo';

describe('UserService', () => {
  let userService: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    userService = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that no pending requests are outstanding
  });

  it('should be created', () => {
    expect(userService).toBeTruthy();
  });

  describe('register', () => {
    let user: Register;
    
    beforeEach(() => {  
      user = {
        firstName: 'Test',
        lastName: 'User',
        login: 'testuser',
        password: 'testpass',
      };
    });

    it('should call httpClient.post with correct URL and user data', () => {
      let response: { message: string } | undefined;

      userService.register(user).subscribe((value) => {
        response = value as { message: string };
      });

      const req = httpMock.expectOne('/api/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(user);
      req.flush({ message: 'User registered successfully' });

      expect(response).toEqual({ message: 'User registered successfully' });
    });

    it('should return Observable', () => {
      const result = userService.register(user);
      expect(result).toBeDefined();

      result.subscribe();

      const req = httpMock.expectOne('/api/register');
      req.flush({ message: 'registered' });
    });

    it.each([
      [400, 'Bad Request', 'Invalid data'],
      [500, 'Internal Server Error', 'Server error'],
    ])('should handle HTTP %i error', async (status, statusText, errorMessage) => {
      await new Promise<void>((resolve) => {
        userService.register(user).subscribe(
          () => {
            fail(`should have failed with ${status} error`);
          },
          (error) => {
            expect(error.status).toBe(status);
            resolve();
          }
        );

        const req = httpMock.expectOne('/api/register');
        req.flush(errorMessage, { status, statusText });
      });
    });
  });

  describe('login', () => {
    let user: Login;
    
    beforeEach(() => {
      user = {
        login: 'testuser',
        password: 'testpass',
       };
    });
    it('should call httpClient.post with correct URL and user data', () => {
      let response: { token: string } | undefined;

      userService.login(user).subscribe((value) => {
        response = value;
      });

      const req = httpMock.expectOne('/api/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(user);
      req.flush({ token: 'mock-jwt-token' });

      expect(response).toEqual({ token: 'mock-jwt-token' });
    });

    it('should return Observable with token property', () => {
      let response: { token: string } | undefined;

      userService.login(user).subscribe((value) => {
        response = value;
      });

      const req = httpMock.expectOne('/api/login');
      req.flush({ token: 'jwt-token-123' });

      expect(response?.token).toBeDefined();
      expect(typeof response?.token).toBe('string');
    });

    it.each([
      [401, 'Unauthorized', 'Invalid credentials'],
      [404, 'Not Found', 'User not found'],
      [500, 'Internal Server Error', 'Server error'],
    ])('should handle HTTP %i error', async (status, statusText, errorMessage) => {
      await new Promise<void>((resolve) => {
        userService.login(user).subscribe(
          () => {
            fail(`should have failed with ${status} error`);
          },
          (error) => {
            expect(error.status).toBe(status);
            resolve();
          }
        );

        const req = httpMock.expectOne('/api/login');
        req.flush(errorMessage, { status, statusText });
      });
    });

    it('should have strongly typed response with token property', () => {
      let response: { token: string } | undefined;

      userService.login(user).subscribe((value) => {
        response = value;
      });

      const req = httpMock.expectOne('/api/login');
      req.flush({ token: 'valid-jwt-token' });

      expect(response).toHaveProperty('token');
      expect(response?.token).toBe('valid-jwt-token');
    });
  });

  describe('listUsers', () => {
    it('should call httpClient.get with correct URL and return users', () => {
      const expectedUsers: UserBasicInfo[] = [
        { id: 1, firstName: 'Jane', lastName: 'Doe', role: 'ADMIN' },
        { id: 2, firstName: 'John', lastName: 'Smith', role: 'USER' },
      ];
      let response: UserBasicInfo[] | undefined;

      userService.listUsers().subscribe((value) => {
        response = value;
      });

      const req = httpMock.expectOne('/api/read-user');
      expect(req.request.method).toBe('GET');
      req.flush(expectedUsers);

      expect(response).toEqual(expectedUsers);
    });
  });

  describe('getUserById', () => {
    it('should call httpClient.get with correct URL and return user details', () => {
      const userId = 42;
      const expectedUser: UserDetailInfo = {
        id: userId,
        firstName: 'Jane',
        lastName: 'Doe',
        login: 'jdoe',
        role: 'ADMIN',
        created_at: '2026-01-01T10:00:00.000Z',
        updated_at: '2026-01-02T10:00:00.000Z',
      };
      let response: UserDetailInfo | undefined;

      userService.getUserById(userId).subscribe((value) => {
        response = value;
      });

      const req = httpMock.expectOne(`/api/read-user/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(expectedUser);

      expect(response).toEqual(expectedUser);
    });
  });

  describe('createUser', () => {
    it('should call httpClient.post with correct URL and user data', () => {
      const user: AddUser = {
        firstName: 'Test',
        lastName: 'User',
        login: 'testuser',
        password: 'testpass',
        role: 'USER',
      };
      let response: object | undefined;

      userService.createUser(user).subscribe((value) => {
        response = value;
      });

      const req = httpMock.expectOne('/api/add-user');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(user);
      req.flush({ message: 'User created successfully' });

      expect(response).toEqual({ message: 'User created successfully' });
    });
  });

  describe('updateUser', () => {
    it('should call httpClient.put with correct URL and user data', () => {
      const userId = 7;
      const user: AddUser = {
        firstName: 'Updated',
        lastName: 'User',
        login: 'updateduser',
        password: 'newpass',
        role: 'ADMIN',
      };
      let response: object | undefined;

      userService.updateUser(userId, user).subscribe((value) => {
        response = value;
      });

      const req = httpMock.expectOne(`/api/update-user/${userId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(user);
      req.flush({ message: 'User updated successfully' });

      expect(response).toEqual({ message: 'User updated successfully' });
    });
  });

  describe('deleteUser', () => {
    it('should call httpClient.get with correct URL and return success response', () => {
      const userId = 9;
      let response: object | undefined;

      userService.deleteUser(userId).subscribe((value) => {
        response = value;
      });

      const req = httpMock.expectOne(`/api/delete-user/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush({ message: 'User deleted successfully' });

      expect(response).toEqual({ message: 'User deleted successfully' });
    });
  });
});
