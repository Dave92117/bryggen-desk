// Fills the database with Norwegian sample tickets.
// Deletes ALL tickets first and restarts numbering at 1 – demo data only.
// Run with: npm run db:seed
import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "./index";
import { tickets, type NewTicket } from "./schema";

// Placeholder user ids until real demo users arrive with Better Auth on Day 3.
const EMPLOYEE_1 = "seed-employee-1";
const EMPLOYEE_2 = "seed-employee-2";
const EMPLOYEE_3 = "seed-employee-3";
const AGENT_1 = "seed-agent-1";
const AGENT_2 = "seed-agent-2";

// Priorities follow the impact × urgency matrix. On Day 4 a tested function takes over.
const sampleTickets: NewTicket[] = [
  {
    title: "Ingen får logget inn på e-post",
    description: "Siden i morges får alle på kontoret feilmelding når de åpner Outlook. Webmail fungerer heller ikke.",
    type: "incident", category: "email", impact: "high", urgency: "high", priority: "P1",
    status: "new", requesterId: EMPLOYEE_1,
  },
  {
    title: "Wi-Fi nede i møterommet",
    description: "En kunde kommer klokken 13, og vi trenger nett i møterommet før det.",
    type: "incident", category: "network", impact: "medium", urgency: "high", priority: "P2",
    status: "new", requesterId: EMPLOYEE_2,
  },
  {
    title: "Skriveren i 2. etasje skriver ikke ut",
    description: "Utskriftene blir liggende i kø. Vi har prøvd å skru den av og på.",
    type: "incident", category: "hardware", impact: "medium", urgency: "medium", priority: "P3",
    status: "in_progress", requesterId: EMPLOYEE_3, assigneeId: AGENT_1,
  },
  {
    title: "VPN kobler fra på hjemmekontor",
    description: "Forbindelsen faller ut omtrent hvert tiende minutt, og jeg må logge inn på nytt.",
    type: "incident", category: "network", impact: "medium", urgency: "medium", priority: "P3",
    status: "in_progress", supportLine: "second", requesterId: EMPLOYEE_1, assigneeId: AGENT_2,
  },
  {
    title: "Ny ansatt starter mandag – trenger PC og tilganger",
    description: "Kari Nordmann begynner i regnskap mandag. Hun trenger bærbar PC, e-post og tilgang til fellesmappen.",
    type: "request", category: "account_access", impact: "low", urgency: "high", priority: "P3",
    status: "new", requesterId: EMPLOYEE_2,
  },
  {
    title: "Låst ute av regnskapssystemet",
    description: "Jeg skrev feil passord tre ganger og er nå låst ute.",
    type: "incident", category: "account_access", impact: "low", urgency: "high", priority: "P3",
    status: "resolved", requesterId: EMPLOYEE_3, assigneeId: AGENT_1,
  },
  {
    title: "Outlook krasjer når jeg åpner PDF-vedlegg",
    description: "Skjer bare med PDF-filer. I mellomtiden leser jeg dem på mobilen.",
    type: "incident", category: "software", impact: "low", urgency: "medium", priority: "P4",
    status: "waiting_for_user", requesterId: EMPLOYEE_1, assigneeId: AGENT_1,
  },
  {
    title: "Treg PC etter siste oppdatering",
    description: "Det tar flere minutter å starte opp, og programmene henger seg ofte.",
    type: "incident", category: "hardware", impact: "low", urgency: "medium", priority: "P4",
    status: "new", requesterId: EMPLOYEE_2,
  },
  {
    title: "Ønsker en ekstra skjerm",
    description: "Jeg jobber mye med regneark og ville hatt god nytte av en skjerm til.",
    type: "request", category: "hardware", impact: "low", urgency: "low", priority: "P4",
    status: "new", requesterId: EMPLOYEE_3,
  },
  {
    title: "Felles kalender for prosjektteamet",
    description: "Prosjektteamet trenger en delt kalender i Outlook.",
    type: "request", category: "email", impact: "medium", urgency: "low", priority: "P4",
    status: "closed", requesterId: EMPLOYEE_1, assigneeId: AGENT_2,
  },
];

async function main() {
  await db.execute(sql`truncate table tickets restart identity`);
  await db.insert(tickets).values(sampleTickets);
  console.log(`Seeded ${sampleTickets.length} tickets.`);
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(() => db.$client.end());
