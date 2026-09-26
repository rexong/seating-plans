"use client";

import { useActionState } from "react";
import { createGuestAction } from "@/app/actions/guests";
import { ColourSelect } from "@/app/components/colour-select";

type Props = {
  eventId: string;
  shareToken: string;
};

export function AddGuestForm({ eventId, shareToken }: Props) {
  const [state, action, pending] = useActionState(createGuestAction, null);

  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="eventId" value={eventId} />
      <input type="hidden" name="shareToken" value={shareToken} />
      <label className="text-sm font-medium text-zinc-700" htmlFor="guest-name">
        Add guest
      </label>
      <input
        id="guest-name"
        name="name"
        required
        maxLength={120}
        placeholder="Display name"
        className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
      />
      <label className="text-sm font-medium text-zinc-700" htmlFor="guest-colour">
        Colour
      </label>
      <ColourSelect id="guest-colour" />
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? "Adding…" : "Add"}
      </button>
      {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
    </form>
  );
}
