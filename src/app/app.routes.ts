import { Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { UsersComponent } from './features/users/users.component';
import { UserFormComponent } from './features/users/user-form.component';
import { SettingsComponent } from './features/settings/settings.component';
import { NotFoundComponent } from './shared/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'users/new', component: UserFormComponent },
      { path: 'users/:id', component: UserFormComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },
  { path: '**', component: NotFoundComponent },
];
