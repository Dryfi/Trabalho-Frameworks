import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UserStoreService } from '../../core/services/user-store.service';
import { UserSettingsApiService } from '../../core/services/user-settings-api.service';
import { ToastService } from '../../core/services/toast.service';
import { UserSettings } from '../../core/models/user-settings';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  private store = inject(UserStoreService);
  private api = inject(UserSettingsApiService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  loading = true;
  userId: string | null = null;

  form = this.fb.nonNullable.group({
    theme: ['system' as 'light' | 'dark' | 'system'],
    currency: ['BRL' as 'BRL' | 'USD'],
    showTrends: [true],
    portfolioValue: [true],
    dailyPnL: [true],
    monthlyPnL: [true],
    positions: [true],
    alerts: [true],
    notes: [true],
  });

  async ngOnInit() {
    this.store.selectedUserId$.subscribe(async (id) => {
      if (!id) return;
      this.userId = id;
      await this.load(id);
    });

    const initial = this.store.selectedUserIdSnapshot();
    if (initial) {
      this.userId = initial;
      await this.load(initial);
    }
  }

  private async load(userId: string) {
    this.loading = true;
    try {
      const s = await firstValueFrom(this.api.get(userId));
      this.patchFromSettings(s);
    } finally {
      this.loading = false;
    }
  }

  private patchFromSettings(s: UserSettings) {
    this.form.patchValue({
      theme: s.theme,
      currency: s.currency,
      showTrends: s.dashboard.showTrends,
      portfolioValue: s.dashboard.cards.portfolioValue,
      dailyPnL: s.dashboard.cards.dailyPnL,
      monthlyPnL: s.dashboard.cards.monthlyPnL,
      positions: s.dashboard.cards.positions,
      alerts: s.dashboard.cards.alerts,
      notes: s.dashboard.cards.notes,
    });
  }

  private toSettings(): UserSettings {
    const v = this.form.getRawValue();
    return {
      userId: this.userId!,
      theme: v.theme,
      currency: v.currency,
      dashboard: {
        showTrends: v.showTrends,
        cards: {
          portfolioValue: v.portfolioValue,
          dailyPnL: v.dailyPnL,
          monthlyPnL: v.monthlyPnL,
          positions: v.positions,
          alerts: v.alerts,
          notes: v.notes,
        }
      }
    };
  }

  async save() {
    if (!this.userId) return;
    const payload = this.toSettings();

    await firstValueFrom(this.api.save(this.userId, payload));
    this.toast.success('Configurações salvas.');
  }

  async resetDefaults() {
    if (!this.userId) return;
    this.patchFromSettings({
      userId: this.userId,
      theme: 'system',
      currency: 'BRL',
      dashboard: {
        showTrends: true,
        cards: { portfolioValue: true, dailyPnL: true, monthlyPnL: true, positions: true, alerts: true, notes: true },
      },
    });
    await this.save();
  }
}
