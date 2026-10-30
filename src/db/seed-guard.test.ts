import { describe, expect, it } from "vitest";
import { assertSafeToSeed } from "./seed-guard";

const LOCAL = "postgres://postgres:postgres@localhost:5432/bryggen_desk";
const NEON = "postgresql://neondb_owner:***@ep-example.eu-central-1.aws.neon.tech/neondb?sslmode=require";

describe("assertSafeToSeed", () => {
  it("allows the local Docker database", () => {
    expect(() => assertSafeToSeed(LOCAL, undefined)).not.toThrow();
  });

  it("refuses Neon by default", () => {
    expect(() => assertSafeToSeed(NEON, undefined)).toThrow(/Refusing to seed production/);
  });

  it("refuses Neon unless the answer is exactly yes", () => {
    expect(() => assertSafeToSeed(NEON, "true")).toThrow();
  });

  it("allows Neon when ALLOW_PRODUCTION_SEED is yes", () => {
    expect(() => assertSafeToSeed(NEON, "yes")).not.toThrow();
  });
});
