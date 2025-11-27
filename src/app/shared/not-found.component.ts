import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [RouterLink, MatButtonModule],
  template: `
    <div class="page" style="display:grid; place-items:center; min-height: 70vh;">
      <div class="app-surface" style="padding: 22px; max-width: 520px; width:100%;">
        <h2 style="margin:0 0 6px 0;">Página não encontrada</h2>
        <p class="muted" style="margin:0 0 16px 0;">Essa rota não existe no UniparInvest.</p>
        <a mat-raised-button color="primary" routerLink="/dashboard">Voltar pro Dashboard</a>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}
