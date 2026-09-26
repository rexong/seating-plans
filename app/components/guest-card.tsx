"use client";

import { useDraggable } from "@dnd-kit/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  GUEST_COLOURS,
  guestColourDotClass,
  guestColourLabel,
} from "@/lib/guest-colours";
import { guestRoleLine } from "@/lib/guest-fields";
import type { SeatingGuest } from "@/lib/seating";

export const GUEST_CARD_CLASS =
  "flex min-h-14 w-full min-w-0 items-start gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2";

type FaceProps = {
  guest: SeatingGuest;
  assignment: string;
  wrapAssignment?: boolean;
};

export function GuestCardFace({
  guest,
  assignment,
  wrapAssignment = false,
}: FaceProps) {
  const role = guestRoleLine(guest);

  return (
    <div className="flex min-w-0 flex-1 items-start gap-2">
      <span
        aria-hidden
        className={`mt-1 size-3 shrink-0 rounded-full ${guestColourDotClass(guest.colour)}`}
      />
      <div className="min-w-0">
        <p className="text-sm font-medium break-words whitespace-normal text-zinc-900">
          {guest.name}
        </p>
        {role ? (
          <p className="text-xs break-words whitespace-normal text-zinc-600">
            {role}
          </p>
        ) : null}
        <p
          className={`text-xs text-zinc-500 ${
            wrapAssignment
              ? "break-words whitespace-normal"
              : "truncate"
          }`}
        >
          {assignment}
        </p>
      </div>
    </div>
  );
}

function ColourPopover({
  guest,
  top,
  left,
  onSelect,
  onClose,
}: {
  guest: SeatingGuest;
  top: number;
  left: number;
  onSelect: (colour: string | null) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (ref.current?.contains(event.target as Node)) {
        return;
      }
      onClose();
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [onClose]);

  return createPortal(
    <div
      ref={ref}
      role="listbox"
      aria-label={`Colour for ${guest.name}`}
      style={{ top, left }}
      className="fixed z-50 flex flex-wrap gap-1.5 rounded-md border border-zinc-200 bg-white p-2 shadow-lg"
    >
      <button
        type="button"
        title="None"
        aria-label="No colour"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(null);
          onClose();
        }}
        className={`size-6 rounded-full border ${
          guest.colour == null
            ? "border-zinc-900 ring-2 ring-zinc-900 ring-offset-1"
            : "border-zinc-300"
        } bg-white`}
      />
      {GUEST_COLOURS.map((colour) => (
        <button
          key={colour}
          type="button"
          title={guestColourLabel(colour)}
          aria-label={guestColourLabel(colour)}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            onSelect(colour);
            onClose();
          }}
          className={`size-6 rounded-full ${guestColourDotClass(colour)} ${
            guest.colour === colour ? "ring-2 ring-zinc-900 ring-offset-1" : ""
          }`}
        />
      ))}
    </div>,
    document.body,
  );
}

type Picker = { top: number; left: number } | null;

function useColourClick(enabled: boolean) {
  const [picker, setPicker] = useState<Picker>(null);
  const dragged = useRef(false);

  const markDrag = useCallback(() => {
    dragged.current = true;
  }, []);

  const onClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!enabled) {
        return;
      }
      if (dragged.current) {
        dragged.current = false;
        return;
      }
      event.stopPropagation();
      const rect = event.currentTarget.getBoundingClientRect();
      setPicker({ top: rect.bottom + 4, left: rect.left });
    },
    [enabled],
  );

  return { picker, setPicker, markDrag, onClick };
}

export function StaticGuestCard({
  guest,
  assignment,
  className = "",
  onColourChange,
}: FaceProps & {
  className?: string;
  onColourChange?: (colour: string | null) => void;
}) {
  const colour = useColourClick(Boolean(onColourChange));

  return (
    <div className="relative min-w-0 w-full flex-1">
      <div
        className={`${GUEST_CARD_CLASS} ${onColourChange ? "cursor-pointer" : ""} ${className}`}
        onClick={colour.onClick}
      >
        <GuestCardFace guest={guest} assignment={assignment} />
      </div>
      {colour.picker && onColourChange ? (
        <ColourPopover
          guest={guest}
          top={colour.picker.top}
          left={colour.picker.left}
          onSelect={onColourChange}
          onClose={() => colour.setPicker(null)}
        />
      ) : null}
    </div>
  );
}

export function DraggableGuestCard({
  guest,
  assignment,
  dragId,
  className = "",
  onColourChange,
}: FaceProps & {
  dragId: string;
  className?: string;
  onColourChange?: (colour: string | null) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: dragId,
    data: { guestId: guest.id },
  });
  const colour = useColourClick(Boolean(onColourChange));

  if (isDragging) {
    colour.markDrag();
  }

  return (
    <div className="relative min-w-0 w-full flex-1">
      <div
        ref={setNodeRef}
        className={`${GUEST_CARD_CLASS} cursor-grab touch-none active:cursor-grabbing ${
          isDragging ? "opacity-30" : ""
        } ${className}`}
        onClick={colour.onClick}
        {...listeners}
        {...attributes}
      >
        <GuestCardFace guest={guest} assignment={assignment} />
      </div>
      {colour.picker && onColourChange && !isDragging ? (
        <ColourPopover
          guest={guest}
          top={colour.picker.top}
          left={colour.picker.left}
          onSelect={onColourChange}
          onClose={() => colour.setPicker(null)}
        />
      ) : null}
    </div>
  );
}
