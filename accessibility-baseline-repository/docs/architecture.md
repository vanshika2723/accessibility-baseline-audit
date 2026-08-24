# Architecture & Repository Boundaries

## Goal

Create a maintainable foundation for accessibility-first public-service features.

## Boundaries

```text
┌───────────────────────────────┐
│             Client            │
│ React + Vite                  │
│ Presentation / interaction   │
└───────────────┬───────────────┘
                │ HTTP JSON
┌───────────────▼───────────────┐
│             Server            │
│ Express                       │
│ API / validation / adapters  │
└───────────────┬───────────────┘
                │
┌───────────────▼───────────────┐
│         Audit Evidence        │
│ CSV + docs + screenshots      │
└───────────────────────────────┘
```

## Directory responsibilities

- `client/` — UI, routes, accessibility behavior, styling.
- `server/` — HTTP endpoints, business/data access, integration boundaries.
- `audit/` — raw normalized evidence supplied for this audit.
- `docs/` — decisions, findings, keyboard procedure, setup and architecture.
- `tests/` — smoke/contract tests and future automated accessibility tests.
- `.github/workflows/` — continuous integration.

## First vertical slice

### Accessible Audit Dashboard

**Request:** `GET /api/audit-summary`

**Flow:**

1. React page loads.
2. Client requests the audit summary endpoint.
3. Express reads the audit CSV.
4. Server returns normalized findings and severity counts.
5. Client renders semantic headings, a skip link, status/error messaging, and keyboard-visible focus.

This demonstrates the full request path without coupling the client directly to files or the audit document.

## Next engineering steps

- Add a shared API client.
- Add schema validation.
- Add React Testing Library + axe-core.
- Add Playwright keyboard tests.
- Add Lighthouse CI.
- Add a server-side persistence layer if the audit dashboard becomes multi-user.
