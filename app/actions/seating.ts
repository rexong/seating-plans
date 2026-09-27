"use server";

import { z } from "zod";
import { applySeatAssignment } from "@/db/seating";
import { getEventByShareToken } from "@/db/events";
import { assertOperatorAuthorized } from "@/lib/request-auth";
import type { SeatTarget } from "@/lib/seating";

const eventIdSchema = z.string().uuid();
const guestIdSchema = z.string().uuid();
const targetSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("unseated") }),
  z.object({
    type: z.literal("seat"),
    tableId: z.string().uuid(),
    seatIndex: z.number().int().min(1).max(10),
  }),
]);

export type AssignSeatResult = { error?: string } | null;

async function assertAuthorized() {
  await assertOperatorAuthorized();
}

export async function assignSeatAction(input: {
  eventId: string;
  shareToken: string;
  guestId: string;
  target: SeatTarget;
}): Promise<AssignSeatResult> {
  await assertAuthorized();

  const eventId = eventIdSchema.safeParse(input.eventId);
  const shareToken = z.string().min(1).safeParse(input.shareToken);
  const guestId = guestIdSchema.safeParse(input.guestId);
  const target = targetSchema.safeParse(input.target);

  if (!eventId.success || !shareToken.success || !guestId.success) {
    return { error: "Invalid seating move" };
  }
  if (!target.success) {
    return { error: "Invalid seat" };
  }

  const event = await getEventByShareToken(shareToken.data);
  if (!event || event.id !== eventId.data) {
    return { error: "Event not found" };
  }

  try {
    await applySeatAssignment({
      eventId: event.id,
      guestId: guestId.data,
      target: target.data,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not update seating";
    return { error: message };
  }

  return null;
}