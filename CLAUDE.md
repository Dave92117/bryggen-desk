# CLAUDE.md – Bryggen Desk

@AGENTS.md

## What this project is

Bryggen Desk is a small ITIL-style helpdesk for Bergen businesses with 10–50 employees. Employees report IT problems and requests, agents work them through a fixed status flow, and an AI assistant suggests category, priority and a knowledge-base article that a human accepts or edits.

It is a portfolio project. The owner, David, must be able to explain every line in a job interview, so understanding matters more than speed.

## Stack

Next.js 16 (App Router, Cache Components on) · TypeScript (strict) · PostgreSQL via Drizzle ORM (schema in `src/db/schema.ts`, migrations in `drizzle/`) · Zod · Better Auth (email/password, httpOnly session cookies) · Tailwind CSS · Vitest and Playwright · GitHub Actions · Vercel and Neon.

## How we work together

1. **Plan before code.** For anything bigger than a one-line fix, first write a short plan – files to touch, approach, tests – and wait for approval.
2. **Small steps.** One logical change at a time. Stop after each step so David can review the diff.
3. **Explain every change.** Say what you changed, why, and name the concept behind it (for example "this is a server action"), in plain language.
4. **Tests come with the code.** New rules and policies get Vitest tests in the same step. Never delete or weaken a test to make it pass; if a test looks wrong, say so and ask.
5. **Don't guess at APIs.** Next.js 16 differs from older versions (for example, `middleware.ts` is now `proxy.ts`). Read the relevant guide in `node_modules/next/dist/docs/` before using a Next.js API. For Better Auth and Drizzle, follow their current official docs and say which page you used.
6. **Ask instead of assuming** when a requirement is unclear.

## Rules that never change

- Every server action and route handler calls the policy module before it reads or changes data. No exceptions.
- Validate all input with Zod on the server. Treat AI output as untrusted input too.
- Never hardcode or commit secrets. Secrets live in `.env` (git-ignored); document every new variable in `.env.example`.
- Seeds, tests and prompts use invented sample data only. No real personal data.
- The AI only suggests. It never changes a ticket's status, priority or assignee on its own.
- Status changes follow the allowed transitions, and every change writes an audit event.
- Ask before adding a dependency.
- TypeScript strict mode: no `any` without a comment explaining why.

## Commands

- `docker compose up -d` – start local Postgres (`docker compose stop` to stop it)
- `npm run dev` – start the app on http://localhost:3000; health check at `/api/health`
- `npm run lint`, `npm run typecheck`, `npm run build` – the same checks CI runs
- `npm run db:generate`, then `npm run db:migrate` – create and apply a migration after a schema change
- `npm run db:studio` – browse the database
- Later: `npm test` for Vitest, `npm run test:e2e` for Playwright

## Definition of done

Lint, type check and tests pass locally. New behaviour has tests. README, ADRs and `.env.example` are updated when relevant. David has reviewed the diff and can explain it.

## Domain terms

- **Incident** (hendelse): something is broken. **Request** (forespørsel): someone needs something.
- **Priority** = impact × urgency, giving P1–P4.
- **SLA**: response and resolution targets per priority. Status is OK, at risk (75% of the time used) or breached (over 100%), on a 24/7 clock.
- **Statuses**: `new` → `in_progress` ⇄ `waiting_for_user`; `in_progress` → `resolved` → `closed`; `resolved` → `in_progress` (reopen).
- **Roles**: `employee` (sluttbruker), `agent` (1st or 2nd line), `admin`.
- UI text is Norwegian (bokmål). Code, comments, commit messages and docs are English.

## Commits

Conventional Commits: `feat:`, `fix:`, `test:`, `docs:`, `chore:`, `refactor:`. One logical change per commit.
