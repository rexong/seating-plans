"use client";

import { useMemo, useState } from "react";
import { AddGuestForm } from "@/app/components/add-guest-form";
import { BulkAddGuests } from "@/app/components/bulk-add-guests";
import { DeleteGuestButton } from "@/app/components/delete-guest-button";
import {
  guestColourDotClass,
  guestColourLabel,
} from "@/lib/guest-colours";

type Guest = {
  id: string;
  name: string;
  colour: string | null;
};

type Props = {
  eventId: string;
  shareToken: string;
  guests: Guest[];
  listError: string | null;
};

export function GuestSidebar({
  eventId,
  shareToken,
  guests,
  listError,
}: Props) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return guests;
    }
    return guests.filter((guest) => guest.name.toLowerCase().includes(needle));
  }, [guests, query]);

  return (
    <aside className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-700" htmlFor="guest-search">
          Search
        </label>
        <input
          id="guest-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Find a name"
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
        />
      </div>
      <AddGuestForm eventId={eventId} shareToken={shareToken} />
      <BulkAddGuests eventId={eventId} shareToken={shareToken} />

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Guests</h2>
        {listError ? (
          <p className="text-red-700">Could not load guests: {listError}</p>
        ) : guests.length === 0 ? (
          <p className="text-zinc-600">No guests yet.</p>
        ) : visible.length === 0 ? (
          <p className="text-zinc-600">No guests match “{query.trim()}”.</p>
        ) : (
          <ul className="divide-y divide-zinc-200 rounded-md border border-zinc-200 bg-white">
            {visible.map((guest) => (
              <li
                key={guest.id}
                className="flex items-center justify-between gap-3 px-3 py-2"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    aria-hidden
                    className={`size-3 shrink-0 rounded-full ${guestColourDotClass(guest.colour)}`}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-900">
                      {guest.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {guestColourLabel(guest.colour)}
                    </p>
                  </div>
                </div>
                <DeleteGuestButton
                  eventId={eventId}
                  shareToken={shareToken}
                  guestId={guest.id}
                  guestName={guest.name}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  );
}
