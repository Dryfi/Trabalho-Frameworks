import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { apiPaths } from '../api/api-paths';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  list(): Observable<User[]> {
    return this.http.get<User[]>(`${this.base}${apiPaths.users}`);
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.base}${apiPaths.userById(id)}`);
  }

  create(payload: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(`${this.base}${apiPaths.users}`, payload);
  }

  update(id: string, payload: Omit<User, 'id'>): Observable<User> {
    return this.http.put<User>(`${this.base}${apiPaths.userById(id)}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}${apiPaths.userById(id)}`);
  }
}
