"use client";

import { createEventAction } from "@/app/actions/events";
import { useToastAction } from "@/app/components/toast-provider";

export function CreateEventForm() {
  const [state, action, pending] = useToastAction(createEventAction, null);

  return (
    <form action={action} className="flex flex-col gap-2">
      <label className="text-sm font-medium text-zinc-700" htmlFor="event-name">
        Event name
      </label>
      <div className="flex gap-2">
        <input
          id="event-name"
          name="name"
          required
          maxLength={120}
          placeholder="Dinner, wedding rehearsal…"
          className="min-w-0 flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {pending ? "Creating…" : "Create"}
        </button>
      </div>
      {state?.error ? (
        <p className="text-sm text-red-700">{state.error}</p>
      ) : null}
    </form>
  );
}
