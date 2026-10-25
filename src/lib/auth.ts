import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

// Server-side login setup. Reads BETTER_AUTH_SECRET and BETTER_AUTH_URL from the environment.
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: {
    enabled: true,
    // No public registration: users are created by the seed now, and by an admin later.
    disableSignUp: true,
  },
  user: {
    additionalFields: {
      // input: false means nobody can choose their own role when signing in or updating their profile.
      role: { type: "string", required: false, defaultValue: "employee", input: false },
    },
  },
});
