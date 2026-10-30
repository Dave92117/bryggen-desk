import { boolean, integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

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
  // Every ticket points at a real user. The database refuses to delete a user who has
  // reported tickets; if an agent is deleted, their tickets simply become unassigned.
  requesterId: text("requester_id")
    .notNull()
    .references(() => user.id),
  assigneeId: text("assignee_id").references(() => user.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// TypeScript types that follow the table automatically.
export type Ticket = typeof tickets.$inferSelect;
export type NewTicket = typeof tickets.$inferInsert;
export type TicketType = (typeof ticketTypeEnum.enumValues)[number];
export type TicketCategory = (typeof ticketCategoryEnum.enumValues)[number];
export type Level = (typeof levelEnum.enumValues)[number];
export type Priority = (typeof priorityEnum.enumValues)[number];
export type TicketStatus = (typeof ticketStatusEnum.enumValues)[number];

// ---------------------------------------------------------------------------
// Login tables used by Better Auth. Column names follow Better Auth's own
// definitions; only the role column is ours.
// ---------------------------------------------------------------------------

export const userRoleEnum = pgEnum("user_role", ["employee", "agent", "admin"]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: userRoleEnum("role").notNull().default("employee"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
  scope: text("scope"),
  // The hashed password for email login. Never the password itself.
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Role = (typeof userRoleEnum.enumValues)[number];
