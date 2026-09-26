"use client";

import { useActionState, useState } from "react";
import { deleteGuestAction } from "@/app/actions/guests";
import { ConfirmModal } from "@/app/components/confirm-modal";

type Props = {
  eventId: string;
  shareToken: string;
  guestId: string;
  guestName: string;
};

export function DeleteGuestButton({
  eventId,
  shareToken,
  guestId,
  guestName,
}: Props) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(deleteGuestAction, null);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm text-red-700 underline-offset-2 hover:underline"
      >
        Delete
      </button>
      {open ? (
        <form action={action}>
          <input type="hidden" name="eventId" value={eventId} />
          <input type="hidden" name="shareToken" value={shareToken} />
          <input type="hidden" name="id" value={guestId} />
          <ConfirmModal
            title="Delete guest"
            description={`Delete “${guestName}”? This cannot be undone.`}
            confirmLabel="Delete guest"
            pending={pending}
            error={state?.error}
            onCancel={() => setOpen(false)}
          />
        </form>
      ) : null}
    </>
  );
}
