"use client";

import { useDroppable } from "@dnd-kit/core";
import { useMemo, useState } from "react";
import { AddGuestForm } from "@/app/components/add-guest-form";
import { BulkAddGuests } from "@/app/components/bulk-add-guests";
import { DeleteGuestButton } from "@/app/components/delete-guest-button";
import { DraggableGuestCard, StaticGuestCard } from "@/app/components/guest-card";
import {
  guestAssignmentLabel,
  isSeated,
  type SeatingGuest,
} from "@/lib/seating";

type Tab = "all" | "seated" | "unseated";

type Props = {
  eventId: string;
  shareToken: string;
  guests: SeatingGuest[];
  tableLabels: Record<string, string>;
  listError: string | null;
  interactive: boolean;
};

function UnseatedDroppable({ children }: { children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: "unseated",
    data: { type: "unseated" },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col gap-2 rounded-md border p-2 ${
        isOver ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 bg-zinc-50"
      }`}
    >
      {children}
    </div>
  );
}

export function GuestSidebar({
  eventId,
  shareToken,
  guests,
  tableLabels,
  listError,
  interactive,
}: Props) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("all");

  const visible = useMemo(() => {
    const byTab = guests.filter((guest) => {
      if (tab === "seated") {
        return isSeated(guest);
      }
      if (tab === "unseated") {
        return !isSeated(guest);
      }
      return true;
    });
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return byTab;
    }
    return byTab.filter((guest) => guest.name.toLowerCase().includes(needle));
  }, [guests, query, tab]);

  const emptyMessage = query.trim()
    ? `No guests match “${query.trim()}”.`
    : tab === "seated"
      ? "No seated guests."
      : tab === "unseated"
        ? "No guests left to seat."
        : "No guests yet.";

  const listBody =
    visible.length === 0 ? (
      <p className="px-1 py-3 text-sm text-zinc-600">{emptyMessage}</p>
    ) : (
      visible.map((guest) => {
        const assignment = guestAssignmentLabel(guest, tableLabels);
        return (
          <div key={guest.id} className="flex items-center gap-1">
            {interactive ? (
              <DraggableGuestCard
                guest={guest}
                assignment={assignment}
                dragId={`list:${guest.id}`}
              />
            ) : (
              <StaticGuestCard guest={guest} assignment={assignment} />
            )}
            <DeleteGuestButton
              eventId={eventId}
              shareToken={shareToken}
              guestId={guest.id}
              guestName={guest.name}
            />
          </div>
        );
      })
    );

  return (
    <aside className="flex w-full flex-col gap-5">
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
        <div className="flex rounded-md border border-zinc-200 bg-white p-0.5 text-xs font-medium">
          {(
            [
              ["all", "All"],
              ["seated", "Seated"],
              ["unseated", "To seat"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={`flex-1 rounded px-2 py-1 ${
                tab === value
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {listError ? (
          <p className="text-red-700">Could not load guests: {listError}</p>
        ) : guests.length === 0 ? (
          <p className="text-zinc-600">No guests yet.</p>
        ) : interactive ? (
          <UnseatedDroppable>{listBody}</UnseatedDroppable>
        ) : (
          <div className="flex flex-col gap-2 rounded-md border border-zinc-200 bg-zinc-50 p-2">
            {listBody}
          </div>
        )}
      </section>
    </aside>
  );
}