import { drizzle } from "drizzle-orm/node-postgres";

// One shared database client for the whole app.
// DATABASE_URL comes from .env locally and from the host's settings in production.
export const db = drizzle(process.env.DATABASE_URL!);
