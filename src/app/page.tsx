import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SignOutButton } from "./sign-out-button";

const roleLabels: Record<string, string> = {
  employee: "Ansatt",
  agent: "Agent",
  admin: "Administrator",
};

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-semibold">Bryggen Desk</h1>
      {/* The session is read per request, so it sits inside Suspense (Cache Components). */}
      <Suspense fallback={<p className="mt-4 text-gray-500">Laster …</p>}>
        <CurrentUser />
      </Suspense>
    </main>
  );
}

async function CurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const role = session.user.role ?? "employee";
  return (
    <div className="mt-4 space-y-4">
      <p>
        Innlogget som <strong>{session.user.name}</strong> ({roleLabels[role] ?? role})
      </p>
      <SignOutButton />
    </div>
  );
}
