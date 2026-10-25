import { createAuthClient } from "better-auth/react";

// Browser-side login helper. Talks to /api/auth on the same site.
export const authClient = createAuthClient();
