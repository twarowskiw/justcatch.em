# Contributing

## Repo goals

This repo is an interview-style demo. Prefer:

- small, readable code
- clear request/response contracts
- predictable behavior (caching, debouncing)
- tests that protect critical logic

Avoid:

- complex architectures (CQRS, DDD layers) unless required
- premature generalization

## Prerequisites

- Docker + Docker Compose
- Node.js LTS (for local dev without Docker)
- .NET 8 SDK (for local dev without Docker)

## Local development (recommended)

Use Docker Compose to run services together.

- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Swagger: http://localhost:8080/swagger

## Code standards

### Frontend

- TypeScript strict mode
- Prefer server components for server-only data fetching (time)
- Client components for interactive form

### Backend

- Keep endpoints in a small number of files
- Use typed `HttpClient` for PokeAPI
- Keep DTOs small

## Testing

- Backend: unit tests + integration tests
- Frontend: component tests

All PRs should keep tests passing.
