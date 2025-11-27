import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UsersApiService } from '../../core/services/users-api.service';
import { UserStoreService } from '../../core/services/user-store.service';
import { ToastService } from '../../core/services/toast.service';
import { User } from '../../core/models/user';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  private usersApi = inject(UsersApiService);
  private store = inject(UserStoreService);
  private toast = inject(ToastService);
  private dialog = inject(MatDialog);

  loading = true;
  displayedColumns = ['name', 'email', 'role', 'status', 'actions'];
  users: User[] = [];

  async ngOnInit() {
    this.loading = true;
    try {
      const users = await firstValueFrom(this.usersApi.list());
      this.users = users;
      this.store.setUsers(users);
    } finally {
      this.loading = false;
    }
  }

  async refresh() {
    this.loading = true;
    try {
      const users = await firstValueFrom(this.usersApi.list());
      this.users = users;
      this.store.setUsers(users);
    } finally {
      this.loading = false;
    }
  }

  async remove(u: User) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Excluir usuário',
        message: `Tem certeza que deseja excluir "${u.name}"?`,
      },
    });

    const ok = await firstValueFrom(ref.afterClosed());
    if (!ok) return;

    await firstValueFrom(this.usersApi.delete(u.id));
    this.toast.success('Usuário removido.');
    await this.refresh();
  }
}
