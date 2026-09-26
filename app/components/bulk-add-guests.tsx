"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createGuestsBulkAction } from "@/app/actions/guests";
import { ColourSelect } from "@/app/components/colour-select";

type Props = {
  eventId: string;
  shareToken: string;
};

export function BulkAddGuests({ eventId, shareToken }: Props) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createGuestsBulkAction, null);
  const lastPending = useRef(false);

  useEffect(() => {
    if (lastPending.current && !pending && !state?.error) {
      setOpen(false);
    }
    lastPending.current = pending;
  }, [pending, state]);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900"
      >
        Bulk add
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 px-4"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget && !pending) {
              setOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="bulk-add-title"
            className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg"
          >
            <h2 id="bulk-add-title" className="text-lg font-medium">
              Bulk add guests
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              One name per line. Colour is none unless you pick one for the
              whole batch.
            </p>
            <form action={action} className="mt-4 flex flex-col gap-3">
              <input type="hidden" name="eventId" value={eventId} />
              <input type="hidden" name="shareToken" value={shareToken} />
              <label
                className="text-sm font-medium text-zinc-700"
                htmlFor="bulk-guest-names"
              >
                Names
              </label>
              <textarea
                id="bulk-guest-names"
                name="names"
                required
                rows={8}
                placeholder={"Ada Lovelace\nGrace Hopper"}
                className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
              />
              <label
                className="text-sm font-medium text-zinc-700"
                htmlFor="bulk-guest-colour"
              >
                Colour for this batch
              </label>
              <ColourSelect id="bulk-guest-colour" />
              {state?.error ? (
                <p className="text-sm text-red-700">{state.error}</p>
              ) : null}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
                >
                  {pending ? "Adding…" : "Add guests"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
