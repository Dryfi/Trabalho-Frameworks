import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UserStoreService {
  private readonly usersSubject = new BehaviorSubject<User[]>([]);
  readonly users$ = this.usersSubject.asObservable();

  private readonly selectedUserIdSubject = new BehaviorSubject<string | null>(null);
  readonly selectedUserId$ = this.selectedUserIdSubject.asObservable();

  usersSnapshot(): User[] {
    return this.usersSubject.value;
  }

  selectedUserIdSnapshot(): string | null {
    return this.selectedUserIdSubject.value;
  }

  setUsers(users: User[]) {
    this.usersSubject.next(users);
    if (!this.selectedUserIdSubject.value && users.length > 0) {
      this.selectedUserIdSubject.next(users[0].id);
    }
  }

  selectUser(userId: string | null) {
    this.selectedUserIdSubject.next(userId);
  }
}
