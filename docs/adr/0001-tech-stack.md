# ADR 0001: Tech stack

- **Date:** 2026-10-22
- **Status:** Accepted

## Context

Bryggen Desk has to be built in about four weeks (roughly 98 hours) by one developer. It must be free to host, have a demo that opens quickly for recruiters, and use tools that employers in Norway use or that teach transferable skills. I already know React, TypeScript, Node.js/Express, PostgreSQL and Drizzle from earlier projects (Divelog and MealMatch).

## Decision

- **Next.js 16 (App Router) with TypeScript** for the interface and server logic in one deployable app.
- **PostgreSQL**: Docker Compose locally and in CI, Neon in production.
- **Drizzle ORM**, with SQL migrations committed to the repo.
- **Zod** to validate all input, including AI output.
- **Better Auth** for authentication (email/password, sessions in httpOnly cookies). Authorization lives in our own policy module.
- **Tailwind CSS** for styling.
- **Vitest** for unit and integration tests, **Playwright** for end-to-end tests.
- **GitHub Actions** for CI, **Vercel** for deployment.

## Alternatives considered

- **Separate Express API and React client, as in Divelog.** Two deployments and two cold starts on free hosting, plus more glue code. Divelog already shows that I can build a standalone REST API.
- **Render's free tier.** Free web services spin down after 15 minutes without traffic and take about a minute to wake, and free Postgres databases expire after 30 days.
- **Writing our own authentication, as in Divelog.** Divelog keeps its JWT in localStorage, where any script on the page can read it. A vetted library with httpOnly session cookies is safer, and lets this project focus on authorization.
- **Supabase for database and auth.** Free projects are paused after a week with little activity, and its built-in auth would hide the access-control logic this project is meant to show.
- **Prisma instead of Drizzle.** A good option, but Drizzle is already familiar and keeps the SQL visible.

## Consequences

- One codebase and one deployment. Pages, server actions and route handlers share the same policy module.
- Next.js 16 has conventions that older tutorials don't cover, such as Cache Components and `proxy.ts` instead of `middleware.ts`. We follow the docs bundled in `node_modules/next/dist/docs/`.
- Neon's free tier scales to zero when idle, so the first request afterwards takes slightly longer.
- Vercel's free Hobby plan is for non-commercial use. That is fine for a portfolio; a real customer would need a paid plan.
