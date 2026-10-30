import { Suspense } from "react";
import { redirect } from "next/navigation";
import { priorityStyles, roleLabels, statusLabels } from "@/lib/labels";
import { canCreateTicket, seesAllTickets } from "@/lib/policy";
import { getActor } from "@/lib/session";
import { listTicketsFor } from "@/lib/tickets";
import { NewTicketForm } from "./new-ticket-form";
import { SignOutButton } from "./sign-out-button";

const dateFormat = new Intl.DateTimeFormat("nb-NO", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Europe/Oslo",
});

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-semibold">Bryggen Desk</h1>
      {/* Everything below depends on who is logged in, so it is rendered per request. */}
      <Suspense fallback={<p className="mt-4 text-gray-500">Laster …</p>}>
        <Desk />
      </Suspense>
    </main>
  );
}

async function Desk() {
  const actor = await getActor();
  if (!actor) redirect("/login");

  const rows = await listTicketsFor(actor);
  const showsAll = seesAllTickets(actor);

  return (
    <>
      <div className="mt-2 flex items-center justify-between gap-4">
        <p>
          Innlogget som <strong>{actor.name}</strong> ({roleLabels[actor.role]})
        </p>
        <SignOutButton />
      </div>

      {canCreateTicket(actor) && (
        <section className="mt-8 rounded border p-4">
          <h2 className="mb-4 text-lg font-medium">Meld inn en sak</h2>
          <NewTicketForm />
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-medium">{showsAll ? "Alle saker" : "Mine saker"}</h2>
        {rows.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">Ingen saker ennå.</p>
        ) : (
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-500">
                <tr>
                  <th className="py-2 pr-4 font-normal">Sak</th>
                  <th className="py-2 pr-4 font-normal">Tittel</th>
                  <th className="py-2 pr-4 font-normal">Prioritet</th>
                  <th className="py-2 pr-4 font-normal">Status</th>
                  {showsAll && <th className="py-2 pr-4 font-normal">Meldt av</th>}
                  <th className="py-2 font-normal">Opprettet</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((ticket) => (
                  <tr key={ticket.id} className="border-t" data-testid="ticket-row">
                    <td className="py-2 pr-4">#{ticket.id}</td>
                    <td className="py-2 pr-4">{ticket.title}</td>
                    <td className="py-2 pr-4">
                      <span className={`rounded px-2 py-0.5 font-medium ${priorityStyles[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="py-2 pr-4">{statusLabels[ticket.status]}</td>
                    {showsAll && <td className="py-2 pr-4">{ticket.requesterName}</td>}
                    <td className="py-2">{dateFormat.format(ticket.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
