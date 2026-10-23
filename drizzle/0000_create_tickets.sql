CREATE TYPE "public"."level" AS ENUM('high', 'medium', 'low');--> statement-breakpoint
CREATE TYPE "public"."priority" AS ENUM('P1', 'P2', 'P3', 'P4');--> statement-breakpoint
CREATE TYPE "public"."support_line" AS ENUM('first', 'second');--> statement-breakpoint
CREATE TYPE "public"."ticket_category" AS ENUM('account_access', 'email', 'hardware', 'software', 'network', 'other');--> statement-breakpoint
CREATE TYPE "public"."ticket_status" AS ENUM('new', 'in_progress', 'waiting_for_user', 'resolved', 'closed');--> statement-breakpoint
CREATE TYPE "public"."ticket_type" AS ENUM('incident', 'request');--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tickets_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"description" text NOT NULL,
	"type" "ticket_type" NOT NULL,
	"category" "ticket_category" NOT NULL,
	"impact" "level" NOT NULL,
	"urgency" "level" NOT NULL,
	"priority" "priority" NOT NULL,
	"status" "ticket_status" DEFAULT 'new' NOT NULL,
	"support_line" "support_line" DEFAULT 'first' NOT NULL,
	"requester_id" text NOT NULL,
	"assignee_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
