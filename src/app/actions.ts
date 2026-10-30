"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { levelEnum, ticketCategoryEnum, tickets, ticketTypeEnum } from "@/db/schema";
import { canCreateTicket } from "@/lib/policy";
import { priorityFor } from "@/lib/priority";
import { getActor } from "@/lib/session";

// Everything the form sends is checked here, on the server. The browser can't be trusted.
const newTicketSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(5).max(2000),
  type: z.enum(ticketTypeEnum.enumValues),
  category: z.enum(ticketCategoryEnum.enumValues),
  impact: z.enum(levelEnum.enumValues),
  urgency: z.enum(levelEnum.enumValues),
});

export type CreateTicketState = { error?: string };

export async function createTicket(
  _previous: CreateTicketState,
  formData: FormData,
): Promise<CreateTicketState> {
  // 1. Who is asking, and may they do this?
  const actor = await getActor();
  if (!actor || !canCreateTicket(actor)) {
    return { error: "Du må være logget inn for å melde inn en sak." };
  }

  // 2. Is the input valid?
  const parsed = newTicketSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: "Sjekk feltene: tittelen trenger minst 3 tegn og beskrivelsen minst 5." };
  }
  const input = parsed.data;

  // 3. Save it. The server sets priority, status and requester; the form can't.
  await db.insert(tickets).values({
    ...input,
    priority: priorityFor(input.impact, input.urgency),
    requesterId: actor.id,
  });

  redirect("/");
}
