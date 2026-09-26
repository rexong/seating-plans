"use client";

import { useActionState } from "react";
import { createTableAction } from "@/app/actions/tables";

type Props = {
  eventId: string;
  shareToken: string;
  label: string;
};

export function CreateTableButton({ eventId, shareToken, label }: Props) {
  const [state, action, pending] = useActionState(createTableAction, null);

  return (
    <form action={action} className="flex flex-col items-start gap-2">
      <input type="hidden" name="eventId" value={eventId} />
      <input type="hidden" name="shareToken" value={shareToken} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? "Creating…" : label}
      </button>
      {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
    </form>
  );
}
