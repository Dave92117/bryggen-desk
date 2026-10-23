import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Allowed values live in the database itself, so it refuses anything else.
export const ticketTypeEnum = pgEnum("ticket_type", ["incident", "request"]);
export const ticketCategoryEnum = pgEnum("ticket_category", [
  "account_access",
  "email",
  "hardware",
  "software",
  "network",
  "other",
]);
export const levelEnum = pgEnum("level", ["high", "medium", "low"]);
export const priorityEnum = pgEnum("priority", ["P1", "P2", "P3", "P4"]);
export const ticketStatusEnum = pgEnum("ticket_status", [
  "new",
  "in_progress",
  "waiting_for_user",
  "resolved",
  "closed",
]);
export const supportLineEnum = pgEnum("support_line", ["first", "second"]);

export const tickets = pgTable("tickets", {
  // The ticket number people see ("Sak #12"). The database counts it up by itself.
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: ticketTypeEnum("type").notNull(),
  category: ticketCategoryEnum("category").notNull(),
  impact: levelEnum("impact").notNull(),
  urgency: levelEnum("urgency").notNull(),
  priority: priorityEnum("priority").notNull(),
  status: ticketStatusEnum("status").notNull().default("new"),
  supportLine: supportLineEnum("support_line").notNull().default("first"),
  // User ids come from Better Auth on Day 3. The links to the user table are added then.
  requesterId: text("requester_id").notNull(),
  assigneeId: text("assignee_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// TypeScript types that follow the table automatically.
export type Ticket = typeof tickets.$inferSelect;
export type NewTicket = typeof tickets.$inferInsert;
