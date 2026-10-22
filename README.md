# Bryggen Desk

A small helpdesk for Bergen businesses with 10–50 employees. Employees report IT problems, agents work them through an ITIL-style flow, and an AI assistant suggests how to sort each ticket while a human makes the call.

**Status:** under construction, built in public in October–November 2026. Daily progress is in [DEVLOG.md](DEVLOG.md).

## Why

Small businesses often handle IT problems by email and hallway conversations, with no history and no overview, while tools like ServiceNow are built for large enterprises. Bryggen Desk covers the core of a real servicedesk – tickets, priorities, SLAs and a knowledge base – in a size that fits a small office.

## Features (MVP)

- [ ] Login with three roles: employee, agent and admin
- [ ] Tickets with impact × urgency giving priority P1–P4
- [ ] Status flow with an audit log of every change
- [ ] SLA targets and an escalation queue
- [ ] Knowledge base linked from resolved tickets
- [ ] AI triage with human approval, measured against an evaluation set
- [ ] Live demo with one-click login per role

## Tech stack

Next.js 16 · TypeScript · PostgreSQL · Drizzle ORM · Zod · Better Auth · Tailwind CSS · Vitest · Playwright · GitHub Actions · Vercel · Neon

## Running locally

You need Node.js 24 and Docker Desktop.

```bash
git clone https://github.com/Dave92117/bryggen-desk.git
cd bryggen-desk
npm install
cp .env.example .env
docker compose up -d
npm run dev
```

Check that the app can reach the database: http://localhost:3000/api/health should answer `{"status":"ok","database":"up"}`.

## Decisions

Architecture decision records are in [docs/adr](docs/adr).

## How AI is used in this project

Claude Code is used as a pair programmer under the rules in [CLAUDE.md](CLAUDE.md): plan first, small changes, tests with every feature, and every diff reviewed before it is accepted. This section will list which parts were AI-assisted and how each was verified.
