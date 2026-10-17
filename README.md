# Emerge Buying House — Website and dashboard

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4. The public website, the public
blog, and the staff dashboard (blog CMS, users, roles and permissions, audit log, profile).

## Run locally

```bash
npm install
cp .env.example .env.local      # point API_PROXY_TARGET at the backend
npm run dev                     # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` / `npm run build` / `npm start` | Develop, build, serve the build |
| `npm test` | Unit and component tests (Vitest + Testing Library) |
| `npm run test:e2e` | End-to-end and responsive tests (Playwright) against a running stack; see `playwright.config.ts` |
| `npm run typecheck` / `npm run lint` / `npm run format` | Static checks and formatting |

## Environment variables

| Name | Where | Purpose |
| --- | --- | --- |
| `API_PROXY_TARGET` | server, build time | Backend origin, e.g. `https://your-backend.vercel.app`. `/api/*` is proxied there, and server components read public blog data from it |
| `NEXT_PUBLIC_API_URL` | browser, build time | Leave **unset** in production so the browser uses the same-origin `/api` proxy, which keeps the refresh cookie first-party. Only for local setups where both apps share a site |
| `NEXT_PUBLIC_CONTACT_EMAIL` | browser, build time | Optional contact address in the footer; hidden when unset |

`NEXT_PUBLIC_*` values and the proxy target are baked in at build time: redeploy after changing them.

## Structure

```
src/
  app/                    Routes only: compose feature components
    (auth)/               /login, /forgot-password, /reset-password
    dashboard/            Signed-in area; each page is gated by the permission it needs
    blog/                 Public blog (server-rendered, cached for 60 s)
    error.tsx, not-found.tsx
  components/
    ui/                   Button, Field/Input/Select/Checkbox, Badge, Card, ConfirmDialog, Skeleton, Pagination
    feedback/             Alert, page states (loading, empty, error, forbidden), toasts
    layout/               Marketing navbar/footer, page header, logo
    sections/             Homepage sections
  features/               auth, dashboard, blog, users (users, roles, audit), profile
  lib/                    HTTP client with token refresh, session handling, form and class helpers
  store/                  Zustand: auth, toasts, mobile menu
  config/site.ts          Public site settings
  types/                  API contracts (mirror the backend)
tests/e2e/                Playwright specs
```

### Design system

All colors, type sizes, radii, shadows, layout widths, layers and durations are tokens in
`src/app/globals.css`, exposed as Tailwind utilities (`bg-primary`, `text-fg-muted`, `text-h1`,
`rounded-md`, `max-w-(--container-content)`…). Use tokens rather than raw values; components accept
`className` overrides, merged safely with `cn()`.

### Authentication

The access token lives only in memory; the refresh token is an HttpOnly, SameSite=Strict cookie
scoped to `/api/auth`. On page load the session is restored from the cookie. The UI hides what the
user may not use, but the backend checks every request.

## Deploying (Vercel)

No Vercel configuration file is needed. Set `API_PROXY_TARGET` to the backend URL, keep
`NEXT_PUBLIC_API_URL` unset, then deploy. On the backend, `CLIENT_ORIGIN` must equal this site's
origin (it is also used for password-reset links).

Note: the public blog list is cached for up to 60 seconds, so a newly published post can take a
minute to appear there (the post's own page is available immediately).
