# justcatch.em

A small full‑stack demo app: register a Pokémon Trainer (name, age, and one starter Pokémon).

## Stack

- Frontend: Next.js (App Router) + TypeScript + MUI + Emotion
- Backend: .NET 8 Minimal API + Swagger
- Infra: Docker Compose
- Backend data source: `apps/backend/assets/pokemon.json`

## Docs

- `AGENTS.md` — instructions for Copilot/AI agents
- `ARCHITECTURE.md` — architecture and API contracts
- `ADR/0001-tech-stack.md` — technology decisions

## Running

### Production-ish (Traefik, single exposed port)

The stack is fronted by Traefik. Only **one** port is exposed on the host (whatever is mapped to Traefik in `docker-compose.yml`).

Run:

```zsh
docker compose up --build
```

Then open:

- App: `http://localhost/`
- Backend (via Traefik): `http://localhost/api/time`

### Dev / Hot reload (Traefik + dotnet watch + next dev)

For hot reload while still using Traefik routing, use the dev compose override:

```zsh
cd /path/to/justcatch.em
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

This runs:

- frontend as `next dev` (HMR)
- backend as `dotnet watch`
- Traefik routes:
	- `/api/*`  backend
	- everything else  frontend

In dev, Swagger UI is available via Traefik at:

- Swagger UI: `http://localhost/swagger`

## Assets

Assets currently live in `assets (to be moved)/` and should be moved into app-specific locations during implementation.

- `pokemon.json` → `apps/backend/assets/pokemon.json` (source list for fuzzy search)
- `Web437_IBM_VGA_9x16.woff` → `apps/frontend/public/fonts/Web437_IBM_VGA_9x16.woff` (IBM VGA font used globally)
