# ADR 0001 — Tech stack

Date: 2025-12-27

## Status

Accepted

## Context

We need a small demo app with a web form (Next.js) and a backend (.NET Minimal API) runnable via Docker Compose. The backend must use:

- FuzzySharp for fuzzy search suggestions
- Yort.Ntp for NTP time
- PokeAPI as an external data source for Pokémon details
- A local `pokemon.json` file as the only local data source

We want modern choices, but without overengineering.

## Decision

- **Frontend**
  - Next.js App Router + TypeScript
  - MUI + Emotion (Styled Components API style)
  - Local font loading (IBM VGA) used globally
  - React Hook Form + Zod for validation
  - TanStack Query for caching and request deduping
  - Vitest + Testing Library + MSW for tests

- **Backend**
  - .NET 8 Minimal API
  - Swagger via Swashbuckle
  - IMemoryCache + typed HttpClient
  - xUnit for tests + WebApplicationFactory for integration tests

- **Infra**
  - Dockerfiles for both apps
  - docker compose for orchestration

## Consequences

- The project stays small and understandable.
- We get production-grade behavior (caching, debouncing, validation) without introducing large architectural patterns.
- Local data (`pokemon.json`) remains simple to load at startup.
