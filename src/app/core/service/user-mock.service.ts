import { Login } from '../models/Login';
import {Register} from '../models/Register';
import {Observable, of} from 'rxjs';
import { UserBasicInfo } from '../models/UserBasicInfo';
import { UserDetailInfo } from '../models/UserDetailInfo';
import { AddUser } from '../models/AddUser';


export class UserMockService {

  register(user: Register): Observable<Object> {
    return of();
  }

  login(user: Login): Observable<{ token: string }> {
    return of({ token: 'mock-token' });
  }

  listUsers(): Observable<UserBasicInfo[]> {
    return of([
      { id: 1, firstName: 'John', lastName: 'Doe', role: 'USER' },
      { id: 2, firstName: 'Jane', lastName: 'Smith', role: 'ADMIN' }
    ]);
  }

  getUserById(userId: number): Observable<UserDetailInfo> {
    return of({
      id: userId,
      firstName: 'John',
      lastName: 'Doe',
      login: 'johndoe',
      role: 'USER',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    });
  }

  createUser(user: AddUser): Observable<Object> {
    return of();
  }

  updateUser(userId: number, user: AddUser): Observable<Object> {
    return of();
  }

  deleteUser(userId: number): Observable<Object> {
    return of();
  }
}