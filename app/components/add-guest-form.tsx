"use client";

import { useActionState } from "react";
import { createGuestAction } from "@/app/actions/guests";

type Props = {
  eventId: string;
  shareToken: string;
  trailing?: React.ReactNode;
};

export function AddGuestForm({ eventId, shareToken, trailing }: Props) {
  const [state, action, pending] = useActionState(createGuestAction, null);

  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="eventId" value={eventId} />
      <input type="hidden" name="shareToken" value={shareToken} />
      <label className="text-sm font-medium text-zinc-700" htmlFor="guest-name">
        Add guest
      </label>
      <div className="flex items-center gap-1.5">
        <input
          id="guest-name"
          name="name"
          required
          maxLength={120}
          placeholder="Display name"
          className="min-w-0 flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
        />
        {trailing}
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {pending ? "…" : "Add"}
        </button>
      </div>
      {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
    </form>
  );
}
