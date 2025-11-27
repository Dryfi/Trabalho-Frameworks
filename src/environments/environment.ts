export const environment = {
  production: false,
  /** Em dev, use '/api' + proxy para evitar CORS */
  apiBaseUrl: '/api',
  /** Se true, responde tudo com dados fake (sem backend) */
  useMockApi: false,
};
