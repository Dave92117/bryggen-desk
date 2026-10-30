import { describe, expect, it } from "vitest";
import { priorityFor } from "./priority";

describe("priorityFor", () => {
  // The whole impact × urgency matrix, written out so the rule is easy to read.
  it.each([
    ["high", "high", "P1"],
    ["high", "medium", "P2"],
    ["high", "low", "P3"],
    ["medium", "high", "P2"],
    ["medium", "medium", "P3"],
    ["medium", "low", "P4"],
    ["low", "high", "P3"],
    ["low", "medium", "P4"],
    ["low", "low", "P4"],
  ] as const)("impact %s and urgency %s give %s", (impact, urgency, expected) => {
    expect(priorityFor(impact, urgency)).toBe(expected);
  });
});
