"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

// Public demo accounts, created by the seed. Not secret on purpose.
const DEMO_PASSWORD = "Bryggen2026!";
const demoUsers = [
  { label: "Ansatt", email: "ansatt@example.com" },
  { label: "Agent", email: "agent@example.com" },
  { label: "Administrator", email: "admin@example.com" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function signIn(loginEmail: string, loginPassword: string) {
    setErrorMessage("");
    setLoading(true);
    const result = await authClient.signIn.email({ email: loginEmail, password: loginPassword });
    setLoading(false);
    if (result.error) {
      setErrorMessage("Feil e-post eller passord.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <main className="mx-auto mt-16 max-w-sm p-6">
      <h1 className="text-2xl font-semibold">Bryggen Desk</h1>
      <p className="mt-1 text-sm text-gray-500">Logg inn for å melde inn og følge opp saker.</p>

      <form
        className="mt-6 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          signIn(email, password);
        }}
      >
        <label className="block text-sm">
          E-post
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Passord
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </label>
        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-700 px-3 py-2 text-white disabled:opacity-60"
        >
          {loading ? "Logger inn …" : "Logg inn"}
        </button>
      </form>

      <section className="mt-8 border-t pt-6">
        <h2 className="text-sm font-medium">Prøv demoen</h2>
        <p className="mt-1 text-xs text-gray-500">Logg inn som en av tre roller med ett klikk.</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {demoUsers.map((demo) => (
            <button
              key={demo.email}
              type="button"
              disabled={loading}
              onClick={() => signIn(demo.email, DEMO_PASSWORD)}
              className="rounded border px-2 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
            >
              {demo.label}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
