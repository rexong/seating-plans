import { and, eq } from "drizzle-orm";
import { getGuestForEvent } from "@/db/guests";
import { getTableById } from "@/db/tables";
import type { SeatTarget } from "@/lib/seating";
import { getDb } from "./index";
import { guests } from "./schema";

async function occupantOfSeat(
  eventId: string,
  tableId: string,
  seatIndex: number,
) {
  const db = getDb();
  const [guest] = await db
    .select()
    .from(guests)
    .where(
      and(
        eq(guests.eventId, eventId),
        eq(guests.tableId, tableId),
        eq(guests.seatIndex, seatIndex),
      ),
    )
    .limit(1);
  return guest ?? null;
}

async function setAssignment(
  guestId: string,
  assignment: { tableId: string | null; seatIndex: number | null },
) {
  const db = getDb();
  await db
    .update(guests)
    .set({
      tableId: assignment.tableId,
      seatIndex: assignment.seatIndex,
      updatedAt: new Date(),
    })
    .where(eq(guests.id, guestId));
}

export async function applySeatAssignment(input: {
  eventId: string;
  guestId: string;
  target: SeatTarget;
}) {
  const guest = await getGuestForEvent(input.eventId, input.guestId);
  if (!guest) {
    throw new Error("Guest not found");
  }

  if (input.target.type === "unseated") {
    if (guest.tableId == null && guest.seatIndex == null) {
      return;
    }
    await setAssignment(guest.id, { tableId: null, seatIndex: null });
    return;
  }

  const table = await getTableById(input.eventId, input.target.tableId);
  if (!table) {
    throw new Error("Table not found");
  }
  if (
    input.target.seatIndex < 1 ||
    input.target.seatIndex > table.seatCount
  ) {
    throw new Error("Invalid seat");
  }

  if (
    guest.tableId === input.target.tableId &&
    guest.seatIndex === input.target.seatIndex
  ) {
    return;
  }

  const occupant = await occupantOfSeat(
    input.eventId,
    input.target.tableId,
    input.target.seatIndex,
  );

  if (!occupant || occupant.id === guest.id) {
    await setAssignment(guest.id, {
      tableId: input.target.tableId,
      seatIndex: input.target.seatIndex,
    });
    return;
  }

  const previous = {
    tableId: guest.tableId,
    seatIndex: guest.seatIndex,
  };

  await setAssignment(guest.id, { tableId: null, seatIndex: null });
  await setAssignment(occupant.id, previous);
  await setAssignment(guest.id, {
    tableId: input.target.tableId,
    seatIndex: input.target.seatIndex,
  });
}