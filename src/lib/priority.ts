import type { Level, Priority } from "@/db/schema";

// Impact (how much of the business is affected) × urgency (how fast it hurts) → priority.
// Rows are impact, columns are urgency.
const MATRIX: Record<Level, Record<Level, Priority>> = {
  high: { high: "P1", medium: "P2", low: "P3" },
  medium: { high: "P2", medium: "P3", low: "P4" },
  low: { high: "P3", medium: "P4", low: "P4" },
};

export function priorityFor(impact: Level, urgency: Level): Priority {
  return MATRIX[impact][urgency];
}
