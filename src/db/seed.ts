// Fills the database with demo users and Norwegian sample tickets.
// Deletes ALL tickets and the demo users first – demo data only.
// Run with: npm run db:seed
import "dotenv/config";
import { inArray, sql } from "drizzle-orm";
import { auth } from "../lib/auth";
import { db } from "./index";
import { tickets, user, type NewTicket, type Role } from "./schema";

// Public demo password – shown on the login page on purpose.
const DEMO_PASSWORD = "Bryggen2026!";

const demoUsers: { key: string; name: string; email: string; role: Role }[] = [
  { key: "employee1", name: "Ingrid Hansen", email: "ansatt@example.com", role: "employee" },
  { key: "employee2", name: "Ola Berg", email: "ansatt2@example.com", role: "employee" },
  { key: "agent1", name: "Sindre Moe", email: "agent@example.com", role: "agent" },
  { key: "agent2", name: "Tor Arne Vik", email: "agent2@example.com", role: "agent" },
  { key: "admin", name: "Marte Sætre", email: "admin@example.com", role: "admin" },
];

// Public sign-up is switched off, so the seed creates users the way Better Auth's
// own sign-up does: hash the password, create the user, link an email/password account.
async function createDemoUsers() {
  const ctx = await auth.$context;
  const ids: Record<string, string> = {};
  for (const demo of demoUsers) {
    const created = await ctx.internalAdapter.createUser(
      {
        name: demo.name,
        email: demo.email,
        emailVerified: true,
        role: demo.role,
      },
      { method: "email-password" },
    );
    await ctx.internalAdapter.linkAccount({
      userId: created.id,
      providerId: "credential",
      accountId: created.id,
      password: await ctx.password.hash(DEMO_PASSWORD),
    });
    ids[demo.key] = created.id;
  }
  return ids;
}

// Priorities follow the impact × urgency matrix. On Day 4 a tested function takes over.
const sampleTickets = (ids: Record<string, string>): NewTicket[] => [
  {
    title: "Ingen får logget inn på e-post",
    description: "Siden i morges får alle på kontoret feilmelding når de åpner Outlook. Webmail fungerer heller ikke.",
    type: "incident", category: "email", impact: "high", urgency: "high", priority: "P1",
    status: "new", requesterId: ids.employee1,
  },
  {
    title: "Wi-Fi nede i møterommet",
    description: "En kunde kommer klokken 13, og vi trenger nett i møterommet før det.",
    type: "incident", category: "network", impact: "medium", urgency: "high", priority: "P2",
    status: "new", requesterId: ids.employee2,
  },
  {
    title: "Skriveren i 2. etasje skriver ikke ut",
    description: "Utskriftene blir liggende i kø. Vi har prøvd å skru den av og på.",
    type: "incident", category: "hardware", impact: "medium", urgency: "medium", priority: "P3",
    status: "in_progress", requesterId: ids.employee2, assigneeId: ids.agent1,
  },
  {
    title: "VPN kobler fra på hjemmekontor",
    description: "Forbindelsen faller ut omtrent hvert tiende minutt, og jeg må logge inn på nytt.",
    type: "incident", category: "network", impact: "medium", urgency: "medium", priority: "P3",
    status: "in_progress", supportLine: "second", requesterId: ids.employee1, assigneeId: ids.agent2,
  },
  {
    title: "Ny ansatt starter mandag – trenger PC og tilganger",
    description: "Kari Nordmann begynner i regnskap mandag. Hun trenger bærbar PC, e-post og tilgang til fellesmappen.",
    type: "request", category: "account_access", impact: "low", urgency: "high", priority: "P3",
    status: "new", requesterId: ids.employee2,
  },
  {
    title: "Låst ute av regnskapssystemet",
    description: "Jeg skrev feil passord tre ganger og er nå låst ute.",
    type: "incident", category: "account_access", impact: "low", urgency: "high", priority: "P3",
    status: "resolved", requesterId: ids.employee2, assigneeId: ids.agent1,
  },
  {
    title: "Outlook krasjer når jeg åpner PDF-vedlegg",
    description: "Skjer bare med PDF-filer. I mellomtiden leser jeg dem på mobilen.",
    type: "incident", category: "software", impact: "low", urgency: "medium", priority: "P4",
    status: "waiting_for_user", requesterId: ids.employee1, assigneeId: ids.agent1,
  },
  {
    title: "Treg PC etter siste oppdatering",
    description: "Det tar flere minutter å starte opp, og programmene henger seg ofte.",
    type: "incident", category: "hardware", impact: "low", urgency: "medium", priority: "P4",
    status: "new", requesterId: ids.employee2,
  },
  {
    title: "Ønsker en ekstra skjerm",
    description: "Jeg jobber mye med regneark og ville hatt god nytte av en skjerm til.",
    type: "request", category: "hardware", impact: "low", urgency: "low", priority: "P4",
    status: "new", requesterId: ids.employee2,
  },
  {
    title: "Felles kalender for prosjektteamet",
    description: "Prosjektteamet trenger en delt kalender i Outlook.",
    type: "request", category: "email", impact: "medium", urgency: "low", priority: "P4",
    status: "closed", requesterId: ids.employee1, assigneeId: ids.agent2,
  },
];

async function main() {
  await db.execute(sql`truncate table tickets restart identity`);
  // Deleting a user also deletes their sessions and accounts (ON DELETE CASCADE).
  await db.delete(user).where(inArray(user.email, demoUsers.map((demo) => demo.email)));
  const ids = await createDemoUsers();
  const rows = sampleTickets(ids);
  await db.insert(tickets).values(rows);
  console.log(`Seeded ${demoUsers.length} users and ${rows.length} tickets.`);
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(() => db.$client.end());
