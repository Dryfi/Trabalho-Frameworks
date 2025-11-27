import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private snack: MatSnackBar) {}

  success(message: string) {
    this.snack.open(message, 'OK', { duration: 2400, panelClass: ['snack-success'] });
  }

  error(message: string) {
    this.snack.open(message, 'OK', { duration: 3600, panelClass: ['snack-error'] });
  }
}
