import { Injectable } from '@angular/core';
import { Register } from '../models/Register';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from '../models/Login';
import { AddUser } from '../models/AddUser';
import { UserBasicInfo } from '../models/UserBasicInfo';
import { UserDetailInfo } from '../models/UserDetailInfo';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient) { }

  register(user: Register): Observable<Object> {
    return this.httpClient.post('/api/register', user);
  }
  
  login(user: Login): Observable<{ token: string }> {
    // return this.httpClient.post('/api/login', user);
    return this.httpClient.post<{ token: string }>('/api/login', user);
  }
  
  listUsers(): Observable<UserBasicInfo[]> {
    return this.httpClient.get<UserBasicInfo[]>('/api/read-user');
  }

  getUserById(userId: number): Observable<UserDetailInfo> {
    return this.httpClient.get<UserDetailInfo>(`/api/read-user/${userId}`);
  }

  createUser(user: AddUser): Observable<Object> {
    return this.httpClient.post('/api/add-user', user);
  }

  updateUser(userId: number, user: AddUser): Observable<Object> {
    return this.httpClient.put(`/api/update-user/${userId}`, user);
  }

  deleteUser(userId: number): Observable<Object> {
    return this.httpClient.get(`/api/delete-user/${userId}`);
  }
}
