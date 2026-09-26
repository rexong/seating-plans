import { and, desc, eq } from "drizzle-orm";
import { getDb } from "./index";
import { guests } from "./schema";

export async function listGuestsForEvent(eventId: string) {
  const db = getDb();
  return db
    .select()
    .from(guests)
    .where(eq(guests.eventId, eventId))
    .orderBy(desc(guests.createdAt));
}

export async function createGuest(input: {
  eventId: string;
  name: string;
  designation?: string | null;
  organisation?: string | null;
}) {
  const db = getDb();
  const [guest] = await db.insert(guests).values(input).returning();
  return guest;
}

export async function createGuests(input: {
  eventId: string;
  guests: {
    name: string;
    designation: string | null;
    organisation: string | null;
  }[];
}) {
  if (input.guests.length === 0) {
    return [];
  }

  const db = getDb();
  return db
    .insert(guests)
    .values(
      input.guests.map((guest) => ({
        eventId: input.eventId,
        name: guest.name,
        designation: guest.designation,
        organisation: guest.organisation,
      })),
    )
    .returning();
}

export async function updateGuestColour(
  eventId: string,
  guestId: string,
  colour: string | null,
) {
  const db = getDb();
  const [guest] = await db
    .update(guests)
    .set({ colour, updatedAt: new Date() })
    .where(and(eq(guests.id, guestId), eq(guests.eventId, eventId)))
    .returning();
  return guest ?? null;
}

export async function getGuestForEvent(eventId: string, guestId: string) {
  const db = getDb();
  const [guest] = await db
    .select()
    .from(guests)
    .where(and(eq(guests.id, guestId), eq(guests.eventId, eventId)))
    .limit(1);
  return guest ?? null;
}

export async function deleteGuestById(eventId: string, guestId: string) {
  const db = getDb();
  const [guest] = await db
    .delete(guests)
    .where(and(eq(guests.id, guestId), eq(guests.eventId, eventId)))
    .returning();
  return guest ?? null;
}
