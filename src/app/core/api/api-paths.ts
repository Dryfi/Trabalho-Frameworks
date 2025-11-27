/**
 * Centralize aqui as rotas do backend.
 * Se o seu back usar outras rotas (ex: /usuarios), ajuste aqui e pronto.
 */
export const apiPaths = {
  users: '/users',
  userById: (id: string) => `/users/${encodeURIComponent(id)}`,
  userSettings: (id: string) => `/users/${encodeURIComponent(id)}/settings`,
  dashboardCards: (userId: string) => `/dashboard/cards?userId=${encodeURIComponent(userId)}`,
};
