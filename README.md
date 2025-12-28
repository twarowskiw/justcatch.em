
# justcatch.em

## Tech

- Frontend: Next.js (App Router) + React + TypeScript, MUI (Emotion), React Hook Form + Zod, TanStack Query, Vitest
- Backend: .NET 8 Minimal API
- Infra: Docker + Docker Compose, Traefik (reverse proxy)

## URLs (via Traefik)

- Default host: `http://localhost:80`
- Frontend: `/`
- Backend API: `/api/*`
- Swagger (dev only): `/swagger`

## Run

### Docker (production)

```bash
docker compose up --build
```

### Docker (development)

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

### Devcontainer

1) VS Code: “Dev Containers: Reopen in Container”

2) Then run either:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

or (no Docker):

```bash
cd apps/backend/src/JustCatch.Backend
dotnet run
```

```bash
cd apps/frontend
npm ci
npm run dev
```
