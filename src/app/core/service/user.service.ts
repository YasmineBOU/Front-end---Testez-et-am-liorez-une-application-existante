import { Injectable } from '@angular/core';
import { Register } from '../models/Register';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from '../models/Login';

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

  // createUser(user: Register): Observable<Object> {
  //   return this.httpClient.post('/api/create-user', user);
  // }
  createUser(user: Register): Observable<Object> {
    return this.httpClient.post('/api/add-user', user);
  }

  updateUser(user: Register): Observable<Object> {
    return this.httpClient.put('/api/update-user/{id}', user);
  }
}
