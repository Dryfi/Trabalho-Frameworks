import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <div style="padding: 18px; min-width: 340px;">
      <h3 style="margin:0 0 6px 0;">{{data.title}}</h3>
      <p class="muted" style="margin:0 0 16px 0;">{{data.message}}</p>
      <div style="display:flex; justify-content:flex-end; gap: 10px;">
        <button mat-button mat-dialog-close="false">Cancelar</button>
        <button mat-raised-button color="warn" [mat-dialog-close]="true">Confirmar</button>
      </div>
    </div>
  `,
})
export class ConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }) {}
}
