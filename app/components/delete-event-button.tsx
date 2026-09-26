"use client";

import { useActionState } from "react";
import { deleteEventAction } from "@/app/actions/events";

type Props = {
  eventId: string;
  eventName: string;
};

export function DeleteEventButton({ eventId, eventName }: Props) {
  const [state, action, pending] = useActionState(deleteEventAction, null);

  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(`Delete “${eventName}”? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={eventId} />
      <button
        type="submit"
        disabled={pending}
        className="text-sm text-red-700 underline-offset-2 hover:underline disabled:opacity-60"
      >
        {pending ? "Deleting…" : "Delete"}
      </button>
      {state?.error ? (
        <p className="mt-1 text-sm text-red-700">{state.error}</p>
      ) : null}
    </form>
  );
}
