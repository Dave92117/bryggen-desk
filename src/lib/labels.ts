import type { Level, Priority, Role, TicketCategory, TicketStatus, TicketType } from "@/db/schema";

// Norwegian text for the values stored in the database.

export const roleLabels: Record<Role, string> = {
  employee: "Ansatt",
  agent: "Agent",
  admin: "Administrator",
};

export const typeLabels: Record<TicketType, string> = {
  incident: "Noe virker ikke (hendelse)",
  request: "Jeg trenger noe (forespørsel)",
};

export const categoryLabels: Record<TicketCategory, string> = {
  account_access: "Tilgang og innlogging",
  email: "E-post og kalender",
  hardware: "PC og utstyr",
  software: "Programvare",
  network: "Nett og Wi-Fi",
  other: "Annet",
};

export const levelLabels: Record<Level, string> = {
  high: "Høy",
  medium: "Middels",
  low: "Lav",
};

export const statusLabels: Record<TicketStatus, string> = {
  new: "Ny",
  in_progress: "Under arbeid",
  waiting_for_user: "Venter på bruker",
  resolved: "Løst",
  closed: "Lukket",
};

export const priorityStyles: Record<Priority, string> = {
  P1: "bg-red-600 text-white",
  P2: "bg-orange-500 text-white",
  P3: "bg-yellow-400 text-black",
  P4: "bg-gray-400 text-black",
};
