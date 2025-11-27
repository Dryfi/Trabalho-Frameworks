# UniparInvest Front (Angular + TypeScript)

Front-end do painel de ações do **UniparInvest**, com:
- **CRUD de Usuários** (tela + formulário);
- **Configurações por usuário** (cada usuário tem seu próprio painel/preferências);
- **Dashboard com seleção de usuário** (troca os cards exibidos);
- UI moderna com **Angular Material**.

## Requisitos de ambiente
- Node.js **>= 20.19.0** (ou 22.12 / 24.x) citeturn17view0
- TypeScript **5.9.x** citeturn17view0

## Como rodar no JetBrains (IntelliJ/WebStorm)
1) Abra a pasta do projeto.
2) No terminal:
```bash
npm install
npm start
```
3) Acesse: http://localhost:4200

## Backend (proxy)
Por padrão o front chama `/api/...` e o Angular faz proxy para:
- `http://localhost:8080` via `src/proxy.conf.json`

Se o seu back estiver em outra porta/rota, ajuste:
- `src/environments/environment.ts` (apiBaseUrl)
- `src/proxy.conf.json` (target)

## Endpoints esperados (padrão do front)
> Ajuste em `src/app/core/api/api-paths.ts` se o seu back tiver rotas diferentes.

- `GET /api/users`
- `GET /api/users/{id}`
- `POST /api/users`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`
- `GET /api/users/{id}/settings`
- `PUT /api/users/{id}/settings`
- `GET /api/dashboard/cards?userId=...`

## Modo mock (opcional)
Se você quiser rodar o front **sem backend**, ative:
`src/environments/environment.ts` → `useMockApi: true`
