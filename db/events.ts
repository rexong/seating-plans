import { desc, eq } from "drizzle-orm";
import { getDb } from "./index";
import { events } from "./schema";

function newShareToken() {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(18))).toString(
    "base64url",
  );
}

export async function listEvents() {
  const db = getDb();
  return db.select().from(events).orderBy(desc(events.createdAt));
}

export async function getEventByShareToken(shareToken: string) {
  const db = getDb();
  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.shareToken, shareToken))
    .limit(1);
  return event ?? null;
}

export async function createEvent(name: string) {
  const db = getDb();
  const [event] = await db
    .insert(events)
    .values({ name, shareToken: newShareToken() })
    .returning();
  return event;
}

export async function deleteEventById(id: string) {
  const db = getDb();
  const [event] = await db
    .delete(events)
    .where(eq(events.id, id))
    .returning();
  return event ?? null;
}
