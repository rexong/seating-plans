"use client";

import { useDroppable } from "@dnd-kit/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AddGuestForm } from "@/app/components/add-guest-form";
import { BulkAddGuests } from "@/app/components/bulk-add-guests";
import { DeleteGuestButton } from "@/app/components/delete-guest-button";
import { DraggableGuestCard, StaticGuestCard } from "@/app/components/guest-card";
import {
  GUEST_COLOURS,
  guestColourDotClass,
  guestColourLabel,
  type GuestColour,
} from "@/lib/guest-colours";
import {
  guestAssignmentLabel,
  isSeated,
  type SeatingGuest,
} from "@/lib/seating";

type Tab = "all" | "seated" | "unseated";
type ColourFilter = GuestColour | "none" | null;

type Props = {
  eventId: string;
  shareToken: string;
  guests: SeatingGuest[];
  tableLabels: Record<string, string>;
  listError: string | null;
  interactive: boolean;
  onColourChange?: (guestId: string, colour: string | null) => void;
};

function UnseatedDroppable({ children }: { children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: "unseated",
    data: { type: "unseated" },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto rounded-md border p-2 ${
        isOver ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 bg-zinc-50"
      }`}
    >
      {children}
    </div>
  );
}

function ColourFilterButton({
  value,
  onChange,
}: {
  value: ColourFilter;
  onChange: (value: ColourFilter) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (
        panelRef.current?.contains(target) ||
        buttonRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const options: { key: ColourFilter; label: string }[] = [
    { key: null, label: "All colours" },
    { key: "none", label: "None" },
    ...GUEST_COLOURS.map((colour) => ({
      key: colour,
      label: guestColourLabel(colour),
    })),
  ];

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        title="Filter by colour"
        aria-label="Filter by colour"
        aria-expanded={open}
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          setPos({ top: rect.bottom + 4, left: rect.right - 176 });
          setOpen((current) => !current);
        }}
        className={`shrink-0 rounded-md p-2 ${
          value
            ? "bg-zinc-900 text-white"
            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
        }`}
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="size-5" aria-hidden>
          <path
            fillRule="evenodd"
            d="M3 4.75A.75.75 0 0 1 3.75 4h12.5a.75.75 0 0 1 .55 1.26L12 11.06V15.5a.75.75 0 0 1-1.12.65l-2.5-1.5A.75.75 0 0 1 8 14V11.06L3.2 5.26A.75.75 0 0 1 3 4.75Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {open
        ? createPortal(
            <div
              ref={panelRef}
              role="listbox"
              aria-label="Filter by colour"
              style={{ top: pos.top, left: Math.max(8, pos.left) }}
              className="fixed z-50 w-44 rounded-md border border-zinc-200 bg-white p-1.5 shadow-lg"
            >
              {options.map((option) => (
                <button
                  key={option.key ?? "all"}
                  type="button"
                  role="option"
                  aria-selected={value === option.key}
                  onClick={() => {
                    onChange(option.key);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm ${
                    value === option.key
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-800 hover:bg-zinc-100"
                  }`}
                >
                  {option.key === null ? (
                    <span className="size-3 shrink-0 rounded-full border border-dashed border-zinc-400" />
                  ) : (
                    <span
                      className={`size-3 shrink-0 rounded-full ${guestColourDotClass(
                        option.key === "none" ? null : option.key,
                      )}`}
                    />
                  )}
                  {option.label}
                </button>
              ))}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

export function GuestSidebar({
  eventId,
  shareToken,
  guests,
  tableLabels,
  listError,
  interactive,
  onColourChange,
}: Props) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [colourFilter, setColourFilter] = useState<ColourFilter>(null);

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
    const byColour = byTab.filter((guest) => {
      if (colourFilter === null) {
        return true;
      }
      if (colourFilter === "none") {
        return guest.colour == null;
      }
      return guest.colour === colourFilter;
    });
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return byColour;
    }
    return byColour.filter((guest) => guest.name.toLowerCase().includes(needle));
  }, [colourFilter, guests, query, tab]);

  const emptyMessage = query.trim()
    ? `No guests match “${query.trim()}”.`
    : colourFilter
      ? `No guests with colour ${guestColourLabel(colourFilter === "none" ? null : colourFilter)}.`
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
        const changeColour = onColourChange
          ? (colour: string | null) => onColourChange(guest.id, colour)
          : undefined;
        return (
          <div key={guest.id} className="flex items-center gap-1">
            {interactive ? (
              <DraggableGuestCard
                guest={guest}
                assignment={assignment}
                dragId={`list:${guest.id}`}
                onColourChange={changeColour}
              />
            ) : (
              <StaticGuestCard
                guest={guest}
                assignment={assignment}
                onColourChange={changeColour}
              />
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
    <aside className="flex min-h-0 flex-1 flex-col gap-3">
      <AddGuestForm
        eventId={eventId}
        shareToken={shareToken}
        trailing={<BulkAddGuests eventId={eventId} shareToken={shareToken} />}
      />

      <section className="flex min-h-0 flex-1 flex-col gap-3">
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
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-zinc-700" htmlFor="guest-search">
            Search
          </label>
          <div className="flex items-center gap-1.5">
            <input
              id="guest-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find a name"
              className="min-w-0 flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
            />
            <ColourFilterButton value={colourFilter} onChange={setColourFilter} />
          </div>
        </div>
        {listError ? (
          <p className="text-red-700">Could not load guests: {listError}</p>
        ) : interactive ? (
          <UnseatedDroppable>{listBody}</UnseatedDroppable>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto rounded-md border border-zinc-200 bg-zinc-50 p-2">
            {listBody}
          </div>
        )}
      </section>
    </aside>
  );
}
