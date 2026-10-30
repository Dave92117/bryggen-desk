import type { Role } from "@/db/schema";

// Who may do what. Every server action and page asks these functions before touching data.

export type Actor = { id: string; role: Role };

const ROLES: readonly Role[] = ["employee", "agent", "admin"];

// Turns the role stored on the session into a known role. Anything unexpected
// becomes "employee", the role with the least access.
export function toRole(value: unknown): Role {
  return ROLES.includes(value as Role) ? (value as Role) : "employee";
}

// Agents and admins work with every ticket. Employees only see their own.
export function seesAllTickets(actor: Actor): boolean {
  return actor.role === "agent" || actor.role === "admin";
}

export function canViewTicket(actor: Actor, ticket: { requesterId: string }): boolean {
  return seesAllTickets(actor) || ticket.requesterId === actor.id;
}

// Everyone who is logged in may report a ticket.
export function canCreateTicket(actor: Actor): boolean {
  return ROLES.includes(actor.role);
}
