import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardCard } from '../models/dashboard';
import { apiPaths } from '../api/api-paths';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  cards(userId: string): Observable<DashboardCard[]> {
    return this.http.get<DashboardCard[]>(`${this.base}${apiPaths.dashboardCards(userId)}`);
  }
}
