"use client";

import { createGuestAction } from "@/app/actions/guests";
import { useToastAction } from "@/app/components/toast-provider";

type Props = {
  eventId: string;
  shareToken: string;
  trailing?: React.ReactNode;
};

const fieldClass =
  "min-w-0 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm";

export function AddGuestForm({ eventId, shareToken, trailing }: Props) {
  const [state, action, pending] = useToastAction(createGuestAction, null);

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
        className={fieldClass}
      />
      <label className="sr-only" htmlFor="guest-designation">
        Designation
      </label>
      <input
        id="guest-designation"
        name="designation"
        maxLength={120}
        placeholder="Designation"
        className={fieldClass}
      />
      <label className="sr-only" htmlFor="guest-organisation">
        Organisation
      </label>
      <input
        id="guest-organisation"
        name="organisation"
        maxLength={120}
        placeholder="Organisation"
        className={fieldClass}
      />
      <div className="flex items-center gap-1.5">
        {trailing}
        <button
          type="submit"
          disabled={pending}
          className="min-w-0 flex-1 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {pending ? "…" : "Add"}
        </button>
      </div>
      {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
    </form>
  );
}
