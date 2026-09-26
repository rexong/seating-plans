"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createGuestsBulkAction } from "@/app/actions/guests";

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
    <>
      <button
        type="button"
        title="Bulk add"
        aria-label="Bulk add"
        onClick={() => setOpen(true)}
        className="shrink-0 rounded-md p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="size-5" aria-hidden>
          <path d="M2 4.75A.75.75 0 0 1 2.75 4h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75Z" />
          <path d="M15.25 9.25a.75.75 0 0 1 .75.75v1.25H17.25a.75.75 0 0 1 0 1.5H16v1.25a.75.75 0 0 1-1.5 0V12.75H13.25a.75.75 0 0 1 0-1.5H14.5V10a.75.75 0 0 1 .75-.75Z" />
        </svg>
      </button>

      {open
        ? createPortal(
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
                  One guest per line as{" "}
                  <span className="font-mono text-xs">
                    name;designation;organisation
                  </span>
                  . Empty extras still need both semicolons (
                  <span className="font-mono text-xs">name;;</span>
                  ). Semicolons cannot appear inside a field. Set a colour later
                  by clicking a guest card.
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
                    placeholder={
                      "Ada Lovelace;Countess of Lovelace;Analytical Engine\nGrace Hopper;Rear Admiral;US Navy"
                    }
                    className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
                  />
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
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
