import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user';
import { UserSettings } from '../models/user-settings';
import { DashboardCard } from '../models/dashboard';

const seedUsers: User[] = [
  { id: '1', name: 'Juliana Correia', email: 'juliana@unipar.br', role: 'ADMIN', active: true },
  { id: '2', name: 'Mateus Dreifke', email: 'mateus@unipar.br', role: 'USER', active: true },
  { id: '3', name: 'Convidado', email: 'guest@unipar.br', role: 'USER', active: false },
];

const defaultSettings = (userId: string): UserSettings => ({
  userId,
  theme: 'system',
  currency: 'BRL',
  dashboard: {
    showTrends: true,
    cards: {
      portfolioValue: true,
      dailyPnL: true,
      monthlyPnL: true,
      positions: true,
      alerts: true,
      notes: true,
    },
  },
});

const settingsDb = new Map<string, UserSettings>(
  seedUsers.map(u => [u.id, defaultSettings(u.id)])
);

const cardsFor = (userId: string): DashboardCard[] => ([
  { id: 'portfolioValue', title: 'Patrimônio', value: 'R$ 128.450,12', subtitle: 'Atual', trendPct: 2.4, icon: 'account_balance_wallet' },
  { id: 'dailyPnL', title: 'P&L diário', value: '+ R$ 1.240,33', subtitle: 'Últimas 24h', trendPct: 0.9, icon: 'trending_up' },
  { id: 'monthlyPnL', title: 'P&L mensal', value: '+ R$ 6.880,00', subtitle: 'No mês', trendPct: 4.1, icon: 'show_chart' },
  { id: 'positions', title: 'Posições', value: '12', subtitle: 'Ativos', icon: 'pie_chart' },
  { id: 'alerts', title: 'Alertas', value: '3', subtitle: 'Pendentes', icon: 'notifications' },
  { id: 'notes', title: 'Notas', value: '5', subtitle: 'Lembretes', icon: 'sticky_note_2' },
]).map(c => ({ ...c, subtitle: userId === '2' ? (c.subtitle ?? '') : c.subtitle }));

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.useMockApi) return next(req);

  const u = new URL(req.url, 'http://local');
  const path = u.pathname.replace(/^\/api/, '');
  const method = req.method.toUpperCase();

  // /users
  if (path === '/users' && method === 'GET') {
    return of(new HttpResponse({ status: 200, body: seedUsers })).pipe(delay(200));
  }

  if (path === '/users' && method === 'POST') {
    const body = req.body as Omit<User, 'id'>;
    const created: User = { ...body, id: String(seedUsers.length + 1) };
    seedUsers.push(created);
    settingsDb.set(created.id, defaultSettings(created.id));
    return of(new HttpResponse({ status: 201, body: created })).pipe(delay(250));
  }

  // /users/:id
  const userIdMatch = path.match(/^\/users\/(.+)$/);
  if (userIdMatch && !path.includes('/settings')) {
    const id = decodeURIComponent(userIdMatch[1]);
    const idx = seedUsers.findIndex(x => x.id === id);
    if (idx === -1) return of(new HttpResponse({ status: 404, body: { message: 'Usuário não encontrado.' } })).pipe(delay(150));

    if (method === 'GET') return of(new HttpResponse({ status: 200, body: seedUsers[idx] })).pipe(delay(120));
    if (method === 'PUT') {
      const body = req.body as Omit<User, 'id'>;
      seedUsers[idx] = { ...seedUsers[idx], ...body };
      return of(new HttpResponse({ status: 200, body: seedUsers[idx] })).pipe(delay(180));
    }
    if (method === 'DELETE') {
      seedUsers.splice(idx, 1);
      settingsDb.delete(id);
      return of(new HttpResponse({ status: 204 })).pipe(delay(180));
    }
  }

  // /users/:id/settings
  const settingsMatch = path.match(/^\/users\/(.+)\/settings$/);
  if (settingsMatch) {
    const id = decodeURIComponent(settingsMatch[1]);
    if (method === 'GET') {
      return of(new HttpResponse({ status: 200, body: settingsDb.get(id) ?? defaultSettings(id) })).pipe(delay(140));
    }
    if (method === 'PUT') {
      const body = req.body as UserSettings;
      settingsDb.set(id, body);
      return of(new HttpResponse({ status: 200, body })).pipe(delay(200));
    }
  }

  // /dashboard/cards
  if (path === '/dashboard/cards' && method === 'GET') {
    const userId = u.searchParams.get('userId') ?? '1';
    return of(new HttpResponse({ status: 200, body: cardsFor(userId) })).pipe(delay(220));
  }

  return next(req);
};
