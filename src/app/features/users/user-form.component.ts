import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { UsersApiService } from '../../core/services/users-api.service';
import { UserSettingsApiService } from '../../core/services/user-settings-api.service';
import { UserStoreService } from '../../core/services/user-store.service';
import { ToastService } from '../../core/services/toast.service';
import { User, UserRole } from '../../core/models/user';
import { UserSettings } from '../../core/models/user-settings';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private usersApi = inject(UsersApiService);
  private settingsApi = inject(UserSettingsApiService);
  private store = inject(UserStoreService);
  private toast = inject(ToastService);

  id: string | null = null;
  loading = true;
  title = 'Novo usuário';

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['USER' as UserRole, [Validators.required]],
    active: [true],
  });

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.title = this.id ? 'Editar usuário' : 'Novo usuário';

    if (!this.id) {
      this.loading = false;
      return;
    }

    try {
      const user = await firstValueFrom(this.usersApi.getById(this.id));
      this.form.setValue({ name: user.name, email: user.email, role: user.role, active: user.active });
    } finally {
      this.loading = false;
    }
  }

  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: Omit<User, 'id'> = {
      name: value.name,
      email: value.email,
      role: value.role,
      active: value.active,
    };

    if (!this.id) {
      const created = await firstValueFrom(this.usersApi.create(payload));
      this.toast.success('Usuário criado.');

      const settings: UserSettings = {
        userId: created.id,
        theme: 'system',
        currency: 'BRL',
        dashboard: {
          showTrends: true,
          cards: { portfolioValue: true, dailyPnL: true, monthlyPnL: true, positions: true, alerts: true, notes: true },
        },
      };
      try { await firstValueFrom(this.settingsApi.save(created.id, settings)); } catch { /* ignore */ }

      await this.refreshStore();
      this.store.selectUser(created.id);
      await this.router.navigate(['/users']);
      return;
    }

    await firstValueFrom(this.usersApi.update(this.id, payload));
    this.toast.success('Usuário atualizado.');
    await this.refreshStore();
    await this.router.navigate(['/users']);
  }

  private async refreshStore() {
    try {
      const users = await firstValueFrom(this.usersApi.list());
      this.store.setUsers(users);
    } catch {
      // ignore
    }
  }
}
