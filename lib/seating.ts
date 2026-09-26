export type SeatTarget =
  | { type: "unseated" }
  | { type: "seat"; tableId: string; seatIndex: number };

export type SeatingGuest = {
  id: string;
  name: string;
  colour: string | null;
  tableId: string | null;
  seatIndex: number | null;
};

export function seatTargetFromOverId(
  overId: string,
  data: unknown,
  guests: SeatingGuest[],
): SeatTarget | null {
  const payload = data as {
    type?: string;
    tableId?: string;
    seatIndex?: number;
  } | undefined;

  if (overId === "unseated" || payload?.type === "unseated") {
    return { type: "unseated" };
  }

  const seatMatch = /^seat:([^:]+):(\d+)$/.exec(overId);
  if (seatMatch) {
    return {
      type: "seat",
      tableId: seatMatch[1],
      seatIndex: Number(seatMatch[2]),
    };
  }

  if (
    payload?.type === "seat" &&
    payload.tableId &&
    typeof payload.seatIndex === "number"
  ) {
    return {
      type: "seat",
      tableId: payload.tableId,
      seatIndex: payload.seatIndex,
    };
  }

  if (overId.startsWith("seat-guest:")) {
    const occupant = guests.find(
      (guest) => guest.id === overId.slice("seat-guest:".length),
    );
    if (occupant?.tableId && occupant.seatIndex != null) {
      return {
        type: "seat",
        tableId: occupant.tableId,
        seatIndex: occupant.seatIndex,
      };
    }
  }

  if (overId.startsWith("list:")) {
    return { type: "unseated" };
  }

  return null;
}

export function guestAssignmentLabel(
  guest: { tableId: string | null; seatIndex: number | null },
  tableLabels: Record<string, string>,
) {
  if (!guest.tableId || guest.seatIndex == null) {
    return "No seat";
  }
  const table = tableLabels[guest.tableId] ?? "Table";
  return `${table} · Seat ${guest.seatIndex}`;
}

export function isSeated(
  guest: { tableId: string | null; seatIndex: number | null },
) {
  return guest.tableId != null && guest.seatIndex != null;
}

export function guestBySeat<
  T extends { tableId: string | null; seatIndex: number | null },
>(guests: T[], tableId: string, seatIndex: number) {
  return (
    guests.find(
      (guest) => guest.tableId === tableId && guest.seatIndex === seatIndex,
    ) ?? null
  );
}

export function applySeatMove(
  guests: SeatingGuest[],
  guestId: string,
  target: SeatTarget,
): SeatingGuest[] {
  const guest = guests.find((row) => row.id === guestId);
  if (!guest) {
    return guests;
  }

  if (target.type === "unseated") {
    if (guest.tableId == null && guest.seatIndex == null) {
      return guests;
    }
    return guests.map((row) =>
      row.id === guestId ? { ...row, tableId: null, seatIndex: null } : row,
    );
  }

  if (
    guest.tableId === target.tableId &&
    guest.seatIndex === target.seatIndex
  ) {
    return guests;
  }

  const occupant = guests.find(
    (row) =>
      row.tableId === target.tableId && row.seatIndex === target.seatIndex,
  );

  if (!occupant || occupant.id === guestId) {
    return guests.map((row) =>
      row.id === guestId
        ? { ...row, tableId: target.tableId, seatIndex: target.seatIndex }
        : row,
    );
  }

  return guests.map((row) => {
    if (row.id === guestId) {
      return { ...row, tableId: target.tableId, seatIndex: target.seatIndex };
    }
    if (row.id === occupant.id) {
      return { ...row, tableId: guest.tableId, seatIndex: guest.seatIndex };
    }
    return row;
  });
}