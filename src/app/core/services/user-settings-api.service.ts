import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserSettings } from '../models/user-settings';
import { apiPaths } from '../api/api-paths';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserSettingsApiService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  get(userId: string): Observable<UserSettings> {
    return this.http.get<UserSettings>(`${this.base}${apiPaths.userSettings(userId)}`);
  }

  save(userId: string, settings: UserSettings): Observable<UserSettings> {
    return this.http.put<UserSettings>(`${this.base}${apiPaths.userSettings(userId)}`, settings);
  }
}
