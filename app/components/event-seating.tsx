"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  closestCorners,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import Link from "next/link";
import { useMemo, useState, useSyncExternalStore, useTransition } from "react";
import { updateGuestColourAction } from "@/app/actions/guests";
import { assignSeatAction } from "@/app/actions/seating";
import { GuestCardFace } from "@/app/components/guest-card";
import { guestCardShellClass } from "@/lib/guest-card-class";
import { GuestSidebar } from "@/app/components/guest-list";
import { TableBoard } from "@/app/components/table-board";
import { toastActionResult, useToast } from "@/app/components/toast-provider";
import {
  applySeatMove,
  guestAssignmentLabel,
  seatingCounts,
  seatTargetFromOverId,
  type SeatTarget,
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
  eventName: string;
  guests: SeatingGuest[];
  tables: EventTable[];
  guestError: string | null;
  tableError: string | null;
};

function isBoardDropId(id: string) {
  return (
    id === "unseated" ||
    id.startsWith("seat:") ||
    id.startsWith("seat-guest:") ||
    id.startsWith("list:")
  );
}

const seatingCollision: CollisionDetection = (args) => {
  const pointerHits = pointerWithin(args).filter((hit) =>
    isBoardDropId(String(hit.id)),
  );
  if (pointerHits.length > 0) {
    return pointerHits;
  }

  const rectHits = rectIntersection(args).filter((hit) =>
    isBoardDropId(String(hit.id)),
  );
  if (rectHits.length > 0) {
    return rectHits;
  }

  return closestCorners(args).filter((hit) => isBoardDropId(String(hit.id)));
};

function guestsKey(rows: SeatingGuest[]) {
  return rows
    .map(
      (guest) =>
        `${guest.id}:${guest.colour ?? ""}:${guest.name}:${guest.designation ?? ""}:${guest.organisation ?? ""}:${guest.tableId ?? ""}:${guest.seatIndex ?? ""}`,
    )
    .join(",");
}

function EventCountStrip({ guests }: { guests: SeatingGuest[] }) {
  const { total, seated, unseated } = seatingCounts(guests);
  return (
    <p className="text-sm text-zinc-600">
      {total} total · {seated} seated · {unseated} unseated
    </p>
  );
}

function SidebarToggle({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="guest-sidebar"
      aria-label={open ? "Hide guests" : "Show guests"}
      className="rounded-md p-1.5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
    >
      <svg viewBox="0 0 20 20" fill="currentColor" className="size-5" aria-hidden>
        {open ? (
          <path
            fillRule="evenodd"
            d="M12.78 4.22a.75.75 0 0 1 0 1.06L8.06 10l4.72 4.72a.75.75 0 1 1-1.06 1.06l-5.25-5.25a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0Z"
            clipRule="evenodd"
          />
        ) : (
          <path
            fillRule="evenodd"
            d="M7.22 4.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 0 1-1.06-1.06L11.94 10 7.22 5.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        )}
      </svg>
    </button>
  );
}

export function EventSeating({
  eventId,
  shareToken,
  eventName,
  guests,
  tables,
  guestError,
  tableError,
}: Props) {
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeGuest, setActiveGuest] = useState<SeatingGuest | null>(null);
  const [seatedGuests, setSeatedGuests] = useState(guests);
  const [guestIds, setGuestIds] = useState(() => guestsKey(guests));
  const incomingIds = guestsKey(guests);
  if (incomingIds !== guestIds) {
    setGuestIds(incomingIds);
    setSeatedGuests(guests);
  }

  const ready = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [, startTransition] = useTransition();

  const tableLabels = useMemo(
    () => Object.fromEntries(tables.map((table) => [table.id, table.label])),
    [tables],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

  function persistMove(guestId: string, target: SeatTarget) {
    const previous = seatedGuests;
    const next = applySeatMove(previous, guestId, target);
    if (next === previous) {
      return;
    }

    setSeatedGuests(next);
    setError(null);

    startTransition(async () => {
      const result = await assignSeatAction({
        eventId,
        shareToken,
        guestId,
        target,
      });
      toastActionResult(result, toast);
      if (result?.error) {
        setSeatedGuests(previous);
        setError(result.error);
      }
    });
  }

  function persistColour(guestId: string, colour: string | null) {
    const previous = seatedGuests;
    const next = previous.map((guest) =>
      guest.id === guestId ? { ...guest, colour } : guest,
    );
    setSeatedGuests(next);
    setError(null);

    startTransition(async () => {
      const result = await updateGuestColourAction({
        eventId,
        shareToken,
        guestId,
        colour,
      });
      toastActionResult(result, toast);
      if (result?.error) {
        setSeatedGuests(previous);
        setError(result.error);
      }
    });
  }

  function onDragStart(event: DragStartEvent) {
    const guestId = event.active.data.current?.guestId;
    setActiveGuest(seatedGuests.find((guest) => guest.id === guestId) ?? null);
    setError(null);
  }

  function onDragEnd(event: DragEndEvent) {
    const guestId = event.active.data.current?.guestId;
    const over = event.over;
    setActiveGuest(null);

    if (!guestId || typeof guestId !== "string" || !over) {
      return;
    }

    const target = seatTargetFromOverId(
      String(over.id),
      over.data.current,
      seatedGuests,
    );
    if (!target) {
      return;
    }

    persistMove(guestId, target);
  }

  const board = (
    <div className="flex h-full min-h-0 w-full min-w-0 items-stretch">
      <div
        id="guest-sidebar"
        className={`h-full overflow-hidden transition-[width,margin] duration-300 ease-out ${
          sidebarOpen ? "mr-8 w-[18.5rem]" : "mr-0 w-0"
        }`}
      >
        <div className="flex h-full w-[18.5rem] min-h-0 flex-col gap-3">
          <div className="flex shrink-0 items-start justify-between gap-2">
            <div className="flex min-w-0 flex-col gap-2">
              <h1 className="text-3xl font-semibold tracking-tight">{eventName}</h1>
              <EventCountStrip guests={seatedGuests} />
              <Link
                href="/"
                className="text-sm font-medium text-zinc-900 underline-offset-2 hover:underline"
              >
                Back to events
              </Link>
            </div>
            <SidebarToggle
              open
              onToggle={() => setSidebarOpen(false)}
            />
          </div>
          <GuestSidebar
            eventId={eventId}
            shareToken={shareToken}
            guests={seatedGuests}
            tableLabels={tableLabels}
            listError={guestError}
            interactive={ready && sidebarOpen}
            onColourChange={persistColour}
          />
        </div>
      </div>
      {sidebarOpen ? null : (
        <div className="mr-3 shrink-0 pt-1">
          <SidebarToggle
            open={false}
            onToggle={() => setSidebarOpen(true)}
          />
        </div>
      )}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {sidebarOpen ? null : (
          <div className="mb-2 flex min-w-0 shrink-0 flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="min-w-0 truncate text-xl font-semibold tracking-tight">
                {eventName}
              </h1>
              <Link
                href="/"
                className="shrink-0 text-sm font-medium text-zinc-900 underline-offset-2 hover:underline"
              >
                Back to events
              </Link>
            </div>
            <EventCountStrip guests={seatedGuests} />
          </div>
        )}
        <TableBoard
          eventId={eventId}
          shareToken={shareToken}
          tables={tables}
          guests={seatedGuests}
          tableLabels={tableLabels}
          listError={tableError}
          interactive={ready}
          onUnseat={(guestId) => persistMove(guestId, { type: "unseated" })}
          onColourChange={persistColour}
        />
      </div>
    </div>
  );

  if (!ready) {
    return (
      <div className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col">
        {board}
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col">
      <DndContext
        id={`event-seating-${eventId}`}
        sensors={sensors}
        collisionDetection={seatingCollision}
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={() => setActiveGuest(null)}
      >
        {error ? <p className="shrink-0 text-sm text-red-700">{error}</p> : null}
        <div className="min-h-0 w-full min-w-0 flex-1">{board}</div>
        <DragOverlay dropAnimation={null}>
          {activeGuest ? (
            <div
              className={guestCardShellClass(
                activeGuest.colour,
                "w-60 cursor-grabbing shadow-lg",
              )}
            >
              <GuestCardFace
                guest={activeGuest}
                assignment={guestAssignmentLabel(activeGuest, tableLabels)}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}