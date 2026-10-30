import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { toRole, type Actor } from "@/lib/policy";

// The logged-in user, in the shape the policy module expects. Null when nobody is logged in.
export async function getActor(): Promise<(Actor & { name: string }) | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  return { id: session.user.id, name: session.user.name, role: toRole(session.user.role) };
}
