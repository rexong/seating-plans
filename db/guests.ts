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
  colour: string | null;
}) {
  const db = getDb();
  const [guest] = await db.insert(guests).values(input).returning();
  return guest;
}

export async function createGuests(input: {
  eventId: string;
  names: string[];
  colour: string | null;
}) {
  if (input.names.length === 0) {
    return [];
  }

  const db = getDb();
  return db
    .insert(guests)
    .values(
      input.names.map((name) => ({
        eventId: input.eventId,
        name,
        colour: input.colour,
      })),
    )
    .returning();
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
