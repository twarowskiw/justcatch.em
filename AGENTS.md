# Agent guidance (Copilot/AI) — justcatch.em

This repository is a small full‑stack demo app:

- **Frontend**: Next.js (App Router) + TypeScript + MUI + Emotion (Styled Components API style)
- **Backend**: .NET 8 Minimal API + Swagger
- **Infra**: Docker + Docker Compose
- **Data sources/assets**:
  - **Backend**: `apps/backend/assets/pokemon.json` (local fuzzy-search source; treated as the only persistent data)
  - **Frontend**: `apps/frontend/public/fonts/Web437_IBM_VGA_9x16.woff` (IBM VGA font)

The goal is to implement a web app with a Pokémon Trainer registration form (trainer name, age, and one starter Pokémon).

## How to work in this repo

### Golden rules

1. **Prefer correctness and clarity over cleverness**. Keep it simple and production‑ish.
2. **Don’t introduce heavy frameworks** (no CQRS/mediator unless clearly needed).
3. **Validate at the edges**:
   - Backend validates request DTOs and returns `201` or `400`.
   - Frontend validates client-side to show field errors.
4. **Cache external API calls**. Never spam PokeAPI for the same Pokémon.
5. **Server-only time**: the date shown in the top-right corner must be fetched only on the server when rendering the initial page.
6. **Fonts**: use IBM VGA font **everywhere**.

### Repository layout (target)

- `apps/frontend/` — Next.js app
- `apps/backend/` — .NET Minimal API
- `apps/backend/assets/` — backend runtime assets (e.g. `pokemon.json`)
- `apps/frontend/public/` — frontend static assets served by Next.js (fonts, icons, etc.)
- `docker-compose.yml` — runs both apps

> Note: assets are currently in `assets (to be moved)/`. During implementation:
> - copy `pokemon.json` into `apps/backend/assets/pokemon.json`
> - copy the font into `apps/frontend/public/fonts/Web437_IBM_VGA_9x16.woff`

## Contracts (API)

Backend must expose:

- `GET /api/time`
  - Returns: current time from an NTP server (e.g. `time.google.com`) using **Yort.Ntp**.
- `GET /api/search?q=...`
  - Returns: list of Pokémon suggestions based on fuzzy search over **local** `pokemon.json` using **FuzzySharp**.
  - Response should be stable and small (e.g. top 10 matches).
- `GET /api/pokemon?id=...`
  - Returns: Pokémon details fetched from **PokeAPI**.
  - Must return a trimmed model (only fields needed by the UI).
  - Must be cached.
- `POST /api/trainer`
  - Accepts: form payload.
  - Validates the payload; returns `201 Created` when OK, `400 Bad Request` on validation error.
  - No persistence required.

## Recommended state-of-the-art (without overengineering)

### Frontend

- **Next.js 15+** (App Router), **React 19**, **TypeScript**
- MUI v6 + Emotion (default in MUI)
- **React Hook Form** for form state
- **Zod** for schema-based validation shared with RHF via resolver
- **TanStack Query** for client-side caching + request deduping (ideal for autocomplete)
- **Testing**: Vitest + React Testing Library + MSW

### Backend

- .NET 8 Minimal API + Swagger
- `IMemoryCache` for caching PokeAPI responses
- Typed `HttpClient` + `HttpClientFactory`
- `FluentValidation` for request validation (simple, explicit rules; no heavy architecture)

> Prefer *minimal* dependencies unless they clearly reduce complexity.

## Frontend behavior (UI contract)

Treat the frontend as a **single-page experience**:

- There is only one route/page (`/`). The registration form is the only page.
- The form is rendered inside a centered container with “hug” sizing (content-driven) rather than full-width.
- In the **top-right corner**, show a server-rendered date formatted like: `Wednesday, 01.01.2025`.
  - The value must be fetched only on the server on first render (no client refetch after hydration).

### Fields

The form contains these inputs:

- Trainer name
- Trainer age
- Pokémon name (**autocomplete**)

Below the fields, show a **preview** of the selected Pokémon inside a container:

- left: Pokémon image
- right: name, types (as labels/chips), base experience, and id

Below everything:

- `Reset` button — resets the entire form
- `Submit` button — submits the form

### Client-side validation rules

- Trainer name: **2-20** characters
- Trainer age: **16-99** (number)
- Pokémon name: must be selected / non-empty

### Submit behavior

- If the form is invalid: do not submit, show validation errors under fields.
- If the form is valid and the backend responds `201`: show a modal titled **"Success"** with a **"Reset form"** button.
- If the backend responds with a non-2xx error: show a simple alert (“something went wrong”); no need to implement granular server error mapping.

## Tooling expectations

- Keep builds green.
- Add tests for:
  - fuzzy search logic (unit)
  - PokeAPI caching behavior (unit)
  - at least one backend integration test hitting endpoints in memory
  - frontend component tests for validation + autocomplete behavior

## Implementation notes for agents

- When introducing new files, keep them close to usage (no giant shared abstractions).
- Avoid hard-coding URLs; use env vars:
  - `POKEAPI_BASE_URL` (default `https://pokeapi.co/api/v2`)
  - `NTP_HOST` (default `time.google.com`)
- Ensure CORS works in docker compose local dev.
- Do not store secrets in repo.
