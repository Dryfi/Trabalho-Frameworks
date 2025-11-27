import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';

import { UsersApiService } from '../core/services/users-api.service';
import { UserStoreService } from '../core/services/user-store.service';
import { User } from '../core/models/user';

@Component({
  standalone: true,
  selector: 'app-shell',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatMenuModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDividerModule,
  ],
  styleUrls: ['./shell.component.scss'],
  templateUrl: './shell.component.html',
})
export class ShellComponent implements OnInit {
  private usersApi = inject(UsersApiService);
  readonly store = inject(UserStoreService);

  users: User[] = [];
  selectedUserId: string | null = null;

  async ngOnInit() {
    this.store.selectedUserId$.subscribe(id => this.selectedUserId = id);
    this.store.users$.subscribe(users => this.users = users);

    try {
      const users = await firstValueFrom(this.usersApi.list());
      this.store.setUsers(users);
    } catch {
      // Erro já tratado pelo interceptor (snackbar)
    }
  }

  onSelectUser(userId: string | null) {
    this.store.selectUser(userId);
  }
}
