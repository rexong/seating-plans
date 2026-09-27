"use client";

import { useDroppable } from "@dnd-kit/core";
import Link from "next/link";
import { CreateTableButton } from "@/app/components/create-table-button";
import { DeleteTableButton } from "@/app/components/delete-table-button";
import {
  DraggableGuestCard,
  GUEST_CARD_CLASS,
  StaticGuestCard,
} from "@/app/components/guest-card";
import { UnseatGuestButton } from "@/app/components/unseat-guest-button";
import {
  guestAssignmentLabel,
  guestBySeat,
  type SeatingGuest,
} from "@/lib/seating";

type EventTable = {
  id: string;
  label: string;
  seatCount: number;
};

type Props = {
  eventId: string;
  shareToken: string;
  tables: EventTable[];
  guests: SeatingGuest[];
  tableLabels: Record<string, string>;
  listError: string | null;
  interactive: boolean;
  onUnseat?: (guestId: string) => void;
  onColourChange?: (guestId: string, colour: string | null) => void;
};

function SeatDroppable({
  tableId,
  tableLabel,
  seatIndex,
  children,
}: {
  tableId: string;
  tableLabel: string;
  seatIndex: number;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `seat:${tableId}:${seatIndex}`,
    data: { type: "seat", tableId, seatIndex },
  });

  return (
    <div
      ref={setNodeRef}
      aria-label={`${tableLabel} seat ${seatIndex}`}
      className={`min-w-0 flex-1 ${
        isOver ? "rounded-md ring-2 ring-zinc-900 ring-offset-2" : ""
      }`}
    >
      {children}
    </div>
  );
}

function SeatCell({
  tableId,
  tableLabel,
  seatIndex,
  guest,
  tableLabels,
  interactive,
  onUnseat,
  onColourChange,
}: {
  tableId: string;
  tableLabel: string;
  seatIndex: number;
  guest: SeatingGuest | null;
  tableLabels: Record<string, string>;
  interactive: boolean;
  onUnseat?: (guestId: string) => void;
  onColourChange?: (guestId: string, colour: string | null) => void;
}) {
  const assignment = guest
    ? guestAssignmentLabel(guest, tableLabels)
    : "";
  const unseat =
    guest == null || !onUnseat ? null : (
      <UnseatGuestButton
        guestName={guest.name}
        onUnseat={() => onUnseat(guest.id)}
      />
    );

  return (
    <div className="flex items-start gap-2">
      <span
        className="mt-2.5 w-5 shrink-0 text-center text-xs font-medium text-zinc-500"
        aria-hidden
      >
        {seatIndex}
      </span>
      {interactive ? (
        <SeatDroppable
          tableId={tableId}
          tableLabel={tableLabel}
          seatIndex={seatIndex}
        >
          {guest ? (
            <div className="relative w-full">
              <DraggableGuestCard
                guest={guest}
                assignment={assignment}
                dragId={`seat-guest:${guest.id}`}
                className="pr-8"
                onColourChange={
                  onColourChange
                    ? (colour) => onColourChange(guest.id, colour)
                    : undefined
                }
              />
              {unseat}
            </div>
          ) : (
            <div className={`${GUEST_CARD_CLASS} border-dashed bg-zinc-50`} />
          )}
        </SeatDroppable>
      ) : guest ? (
        <div className="relative w-full">
          <StaticGuestCard
            guest={guest}
            assignment={assignment}
            className="pr-8"
            onColourChange={
              onColourChange
                ? (colour) => onColourChange(guest.id, colour)
                : undefined
            }
          />
          {unseat}
        </div>
      ) : (
        <div className={`${GUEST_CARD_CLASS} border-dashed bg-zinc-50`} />
      )}
    </div>
  );
}

export function TableBoard({
  eventId,
  shareToken,
  tables,
  guests,
  tableLabels,
  listError,
  interactive,
  onUnseat,
  onColourChange,
}: Props) {
  if (listError) {
    return (
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Tables</h2>
        <p className="text-red-700">Could not load tables: {listError}</p>
      </section>
    );
  }

  if (tables.length === 0) {
    return (
      <section className="flex w-full flex-col items-start gap-3">
        <h2 className="text-lg font-medium">Tables</h2>
        <p className="text-sm text-zinc-700">
          No tables yet. Add a 10-seat table, then drag guests from the sidebar
          onto empty seats.
        </p>
        <CreateTableButton
          eventId={eventId}
          shareToken={shareToken}
          label="Create a table"
        />
      </section>
    );
  }

  return (
    <section className="flex min-h-0 min-w-0 w-full flex-1 flex-col">
      <div className="flex shrink-0 items-start justify-between gap-4 pb-2">
        <h2 className="sr-only">Tables</h2>
        <div className="ml-auto flex items-start gap-2">
          <Link
            href={`/events/${shareToken}/export`}
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Export
          </Link>
          <CreateTableButton
            eventId={eventId}
            shareToken={shareToken}
            label="Add another table"
          />
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-2">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(18.5rem,1fr))] gap-6">
          {tables.map((table) => (
          <article
            key={table.id}
            className="min-w-0 overflow-hidden rounded-md border border-zinc-200 bg-white"
          >
            <header className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-2">
              <h3 className="font-medium text-zinc-900">{table.label}</h3>
              <DeleteTableButton
                eventId={eventId}
                shareToken={shareToken}
                tableId={table.id}
                tableLabel={table.label}
              />
            </header>
            <div className="flex flex-col gap-2 p-3">
              {Array.from({ length: table.seatCount }, (_, index) => {
                const seatIndex = index + 1;
                return (
                  <SeatCell
                    key={seatIndex}
                    tableId={table.id}
                    tableLabel={table.label}
                    seatIndex={seatIndex}
                    guest={guestBySeat(guests, table.id, seatIndex)}
                    tableLabels={tableLabels}
                    interactive={interactive}
                    onUnseat={onUnseat}
                    onColourChange={onColourChange}
                  />
                );
              })}
            </div>
          </article>
          ))}
        </div>
      </div>
    </section>
  );
}