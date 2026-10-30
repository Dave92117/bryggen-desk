"use client";

import { useActionState, useState } from "react";
import type { Level } from "@/db/schema";
import { categoryLabels, levelLabels, priorityStyles, typeLabels } from "@/lib/labels";
import { priorityFor } from "@/lib/priority";
import { createTicket, type CreateTicketState } from "./actions";

const fieldClass = "mt-1 w-full rounded border px-3 py-2";

export function NewTicketForm() {
  const [state, formAction, pending] = useActionState<CreateTicketState, FormData>(createTicket, {});
  const [impact, setImpact] = useState<Level>("low");
  const [urgency, setUrgency] = useState<Level>("low");
  // The same rule the server uses, so the preview always matches what gets saved.
  const priority = priorityFor(impact, urgency);

  return (
    <form action={formAction} className="space-y-4">
      <label className="block text-sm">
        Tittel
        <input name="title" required minLength={3} maxLength={120} className={fieldClass} />
      </label>
      <label className="block text-sm">
        Beskrivelse
        <textarea name="description" required minLength={5} maxLength={2000} rows={3} className={fieldClass} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          Type
          <select name="type" className={fieldClass} defaultValue="incident">
            {Object.entries(typeLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Kategori
          <select name="category" className={fieldClass} defaultValue="other">
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Påvirkning – hvor mange rammes?
          <select name="impact" className={fieldClass} value={impact} onChange={(e) => setImpact(e.target.value as Level)}>
            {Object.entries(levelLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Hastegrad – hvor fort haster det?
          <select name="urgency" className={fieldClass} value={urgency} onChange={(e) => setUrgency(e.target.value as Level)}>
            {Object.entries(levelLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="text-sm">
        Prioritet: <span className={`rounded px-2 py-0.5 font-medium ${priorityStyles[priority]}`}>{priority}</span>
      </p>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button type="submit" disabled={pending} className="rounded bg-blue-700 px-4 py-2 text-white disabled:opacity-60">
        {pending ? "Sender …" : "Meld inn sak"}
      </button>
    </form>
  );
}
