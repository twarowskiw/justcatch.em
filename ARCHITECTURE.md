# Architecture

## Overview

This is a small full‑stack app: a Pokémon Trainer registration form.

- **Frontend**: Next.js (App Router) + TypeScript + MUI/Emotion
- **Backend**: .NET 8 Minimal API
- **Infra**: Docker Compose to run both services

The backend provides three read endpoints (NTP time, search suggestions, Pokémon details) and one write endpoint (trainer submission).

## Data flow

### 1) Initial page load (server-only time)

1. User opens `/`.
2. Next.js server component calls backend `GET /api/time`.
3. The returned timestamp is rendered in the top-right corner.

Constraints:
- The UI must not refetch the time on the client after hydration.

### 2) Autocomplete suggestions (debounced + cached)

1. User types into Pokémon name field.
2. Client debounces input (e.g. 250-400ms).
3. Client queries `GET /api/search?q=<text>`.
4. Suggestions are cached client-side and reused for repeated queries.

Constraints:
- Use a cache/dedup layer (e.g. TanStack Query).

### 3) Pokémon preview (cached backend)

1. User selects a suggestion with `id`.
2. UI requests `GET /api/pokemon?id=<id>`.
3. Backend:
   - checks `IMemoryCache`
   - on cache miss calls PokeAPI and stores result

### 4) Submit trainer

1. User presses `Submit`.
2. If client-side validation fails: show field errors, do not send request.
3. If passes: send `POST /api/trainer`.
4. On 201: show success modal and allow full reset.
5. On backend error: show simple alert.

## Backend design

### Endpoints

- `GET /api/time`
  - Implementation: `Yort.Ntp` client queries `NTP_HOST`.
  - Return JSON: `{ "utc": "...", "source": "time.google.com" }`

- `GET /api/search?q=`
  - Load `apps/backend/assets/pokemon.json` into memory at startup.
  - Use `FuzzySharp` to score matches by Pokémon `name`.
  - Return JSON array: `[{ id, name, score }]` (top N).

- `GET /api/pokemon?id=`
  - Fetch from PokeAPI `/pokemon/{id}`.
  - Map to a small DTO, e.g.
    - `id`, `name`, `sprites.front_default`, `types[]`, `height`, `weight`
  - Cache by `id` for a reasonable TTL (e.g. 1h) + size limit.

- `POST /api/trainer`
  - DTO: `{ name: string, age: number, pokemonId: number, pokemonName: string }`
  - Validation (example):
    - `name`: required, 2-50
    - `age`: required, 10-120 (adjust if spec changes)
    - `pokemonId`: required, must exist in local pokemon.json
    - `pokemonName`: required, must match the id’s name (case-insensitive)

### Non-functional

- Swagger enabled in development
- CORS configured for frontend origin in docker compose
- HTTP timeouts for outbound calls

## Frontend design

## UI specification (single page)

The frontend is a **one-pager** (the form is the only page).

Layout:

- The form sits inside a centered container with “hug” sizing (content-driven width).
- Top-right corner shows a date formatted like `Wednesday, 01.01.2025`.
  - This date is **server-only**: fetched during server rendering once when the user enters the page.

Form fields:

- Trainer name
- Trainer age
- Pokémon name (autocomplete)

Pokémon preview:

- Shown under the inputs once a Pokémon is selected.
- Container content:
  - left: image
  - right: name, type labels, base experience, and id

Actions:

- `Reset` button resets the whole form.
- `Submit` validates on client and submits when valid.

Validation rules (client-side):

- name: 2-20 characters
- age: 16-99
- Pokémon name: required (must select something)

Success state:

- After successful `POST /api/trainer` (HTTP 201) show a modal: title **"Success"** and a **"Reset form"** button.

### Styling and theme

- Load IBM VGA (`public/fonts/Web437_IBM_VGA_9x16.woff`) via Next.js local fonts.
- Use it as the primary font everywhere via the MUI theme.
- Define the design system in a single place:
  - palette, typography, shape, spacing, component overrides

### Forms

- Use React Hook Form + Zod validation.
- Autocomplete uses MUI Autocomplete; responses come from backend search.

## Testing strategy

### Backend

- Unit tests:
  - fuzzy search returns deterministic top matches
  - cache avoids repeated PokeAPI calls (mock HttpMessageHandler)
- Integration tests:
  - Minimal API test host with WebApplicationFactory
  - `GET /api/search` and `POST /api/trainer` happy path & validation errors

### Frontend

- Component tests for:
  - required field validation messages
  - debounce behavior (fake timers)
  - success modal and reset

## Docker

- `backend` container exposes `8080` internally
- `frontend` container exposes `3000`
- Compose routes frontend → backend using internal DNS name (e.g. `http://backend:8080`)

