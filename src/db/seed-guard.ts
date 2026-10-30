// The seed deletes data, so it refuses to run against Neon (production)
// unless you allow it on purpose, for that one PowerShell window.
export function assertSafeToSeed(databaseUrl: string | undefined, allowProduction: string | undefined): void {
  if (databaseUrl?.includes("neon.tech") && allowProduction !== "yes") {
    throw new Error(
      "Refusing to seed production (Neon). If you really mean it, set ALLOW_PRODUCTION_SEED=yes in this window first.",
    );
  }
}
