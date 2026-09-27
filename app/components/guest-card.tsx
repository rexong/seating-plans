"use client";

import { useDraggable } from "@dnd-kit/core";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { guestCardShellClass } from "@/lib/guest-card-class";
import {
  GUEST_COLOURS,
  guestColourDotClass,
  guestColourLabel,
} from "@/lib/guest-colours";
import { guestRoleLine } from "@/lib/guest-fields";
import type { SeatingGuest } from "@/lib/seating";

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
    <div className="min-w-0 flex-1">
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
  );
}

type Picker = { top: number; left: number };

function pickerPosition(rect: DOMRect): Picker {
  const width = 220;
  const left = Math.min(
    Math.max(8, rect.left),
    window.innerWidth - width - 8,
  );
  const top =
    rect.bottom + 8 + 40 > window.innerHeight
      ? Math.max(8, rect.top - 48)
      : rect.bottom + 4;
  return { top, left };
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

    const timer = window.setTimeout(() => {
      document.addEventListener("pointerdown", onPointerDown);
    }, 0);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("pointerdown", onPointerDown);
    };
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

function useColourPicker(enabled: boolean) {
  const [picker, setPicker] = useState<Picker | null>(null);

  function openPicker(event: React.MouseEvent<HTMLElement>) {
    if (!enabled) {
      return;
    }
    setPicker(pickerPosition(event.currentTarget.getBoundingClientRect()));
  }

  return { picker, setPicker, openPicker };
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
  const colour = useColourPicker(Boolean(onColourChange));

  return (
    <div className="relative min-w-0 w-full flex-1">
      <div
        className={guestCardShellClass(
          guest.colour,
          `${onColourChange ? "cursor-pointer" : ""} ${className}`,
        )}
        onClick={colour.openPicker}
        title={onColourChange ? `Colour for ${guest.name}` : undefined}
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
  const colour = useColourPicker(Boolean(onColourChange));
  if (isDragging && colour.picker) {
    colour.setPicker(null);
  }

  return (
    <div className="relative min-w-0 w-full flex-1">
      <div
        ref={setNodeRef}
        className={guestCardShellClass(
          guest.colour,
          `cursor-grab touch-none active:cursor-grabbing ${
            isDragging ? "opacity-30" : ""
          } ${className}`,
        )}
        {...listeners}
        {...attributes}
        onClick={colour.openPicker}
        title={onColourChange ? `Colour for ${guest.name}` : undefined}
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
