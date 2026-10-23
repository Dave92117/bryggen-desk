import { connection } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";

// GET /api/health – answers 200 when the app can reach the database, 503 when it can't.
export async function GET() {
  // Run on every request, never at build time (Next.js 16 Cache Components).
  await connection();

  try {
    await db.execute(sql`select 1`);
    return Response.json({ status: "ok", database: "up" });
  }  catch (error) {
    // Logging the error to the console for debugging purposes
    console.error("Health check failed:", error);
    return Response.json({ status: "error", database: "down" }, { status: 503 });
  }
}
