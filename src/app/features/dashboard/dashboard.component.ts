import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

import { UserStoreService } from '../../core/services/user-store.service';
import { DashboardApiService } from '../../core/services/dashboard-api.service';
import { UserSettingsApiService } from '../../core/services/user-settings-api.service';
import { DashboardCard } from '../../core/models/dashboard';
import { UserSettings } from '../../core/models/user-settings';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private store = inject(UserStoreService);
  private dashApi = inject(DashboardApiService);
  private settingsApi = inject(UserSettingsApiService);

  loading = true;
  cards: DashboardCard[] = [];
  settings: UserSettings | null = null;

  async ngOnInit() {
    this.store.selectedUserId$.subscribe(async (userId) => {
      if (!userId) return;
      await this.load(userId);
    });

    const initialUserId = this.store.selectedUserIdSnapshot();
    if (initialUserId) await this.load(initialUserId);
  }

  private async load(userId: string) {
    this.loading = true;
    try {
      const [settings, cards] = await Promise.all([
        firstValueFrom(this.settingsApi.get(userId)),
        firstValueFrom(this.dashApi.cards(userId)),
      ]);

      this.settings = settings;

      const enabled = new Set(
        Object.entries(settings.dashboard.cards)
          .filter(([, v]) => v)
          .map(([k]) => k)
      );

      this.cards = cards.filter(c => enabled.has(c.id));
    } catch {
      // snack já mostra no interceptor
      this.cards = [];
      this.settings = null;
    } finally {
      this.loading = false;
    }
  }

  trendLabel(trendPct?: number): string {
    if (trendPct === undefined || trendPct === null) return '';
    const sign = trendPct > 0 ? '+' : '';
    return `${sign}${trendPct.toFixed(1)}%`;
  }

  trendClass(trendPct?: number): string {
    if (trendPct === undefined || trendPct === null) return '';
    return trendPct >= 0 ? 'pos' : 'neg';
  }
}
