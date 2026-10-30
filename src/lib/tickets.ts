import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { tickets, user } from "@/db/schema";
import { seesAllTickets, type Actor } from "@/lib/policy";

// The tickets this person is allowed to see, newest first.
// The policy decides the filter; the database does the filtering.
export async function listTicketsFor(actor: Actor) {
  const onlyTheirOwn = seesAllTickets(actor) ? undefined : eq(tickets.requesterId, actor.id);

  return db
    .select({
      id: tickets.id,
      title: tickets.title,
      priority: tickets.priority,
      status: tickets.status,
      createdAt: tickets.createdAt,
      requesterName: user.name,
    })
    .from(tickets)
    .innerJoin(user, eq(tickets.requesterId, user.id))
    .where(onlyTheirOwn)
    .orderBy(desc(tickets.id));
}
