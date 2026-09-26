"use client";

import { useDraggable } from "@dnd-kit/core";
import { guestColourDotClass } from "@/lib/guest-colours";
import type { SeatingGuest } from "@/lib/seating";

export const GUEST_CARD_CLASS =
  "flex h-14 w-60 min-w-60 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3";

type FaceProps = {
  guest: SeatingGuest;
  assignment: string;
};

export function GuestCardFace({ guest, assignment }: FaceProps) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <span
        aria-hidden
        className={`size-3 shrink-0 rounded-full ${guestColourDotClass(guest.colour)}`}
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-zinc-900">{guest.name}</p>
        <p className="h-4 truncate text-xs text-zinc-500">{assignment}</p>
      </div>
    </div>
  );
}

export function StaticGuestCard({ guest, assignment, className = "" }: FaceProps & { className?: string }) {
  return (
    <div className={`${GUEST_CARD_CLASS} ${className}`}>
      <GuestCardFace guest={guest} assignment={assignment} />
    </div>
  );
}

type DraggableProps = FaceProps & {
  dragId: string;
  className?: string;
};

export function DraggableGuestCard({
  guest,
  assignment,
  dragId,
  className = "",
}: DraggableProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: dragId,
    data: { guestId: guest.id },
  });

  return (
    <div
      ref={setNodeRef}
      className={`${GUEST_CARD_CLASS} cursor-grab touch-none active:cursor-grabbing ${
        isDragging ? "opacity-30" : ""
      } ${className}`}
      {...listeners}
      {...attributes}
    >
      <GuestCardFace guest={guest} assignment={assignment} />
    </div>
  );
}