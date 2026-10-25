import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

// Better Auth answers every request under /api/auth/* (sign-in, sign-out, session …).
export const { GET, POST } = toNextJsHandler(auth);
