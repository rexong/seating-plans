import { and, asc, eq } from "drizzle-orm";
import { TABLE_SEAT_COUNT, nextTableLabel } from "@/lib/tables";
import { getDb } from "./index";
import { tables } from "./schema";

export async function listTablesForEvent(eventId: string) {
  const db = getDb();
  return db
    .select()
    .from(tables)
    .where(eq(tables.eventId, eventId))
    .orderBy(asc(tables.createdAt));
}

export async function createTable(eventId: string) {
  const existing = await listTablesForEvent(eventId);
  const db = getDb();
  const [table] = await db
    .insert(tables)
    .values({
      eventId,
      label: nextTableLabel(existing.map((row) => row.label)),
      seatCount: TABLE_SEAT_COUNT,
    })
    .returning();
  return table;
}

export async function deleteTableById(eventId: string, tableId: string) {
  const db = getDb();
  const [table] = await db
    .delete(tables)
    .where(and(eq(tables.id, tableId), eq(tables.eventId, eventId)))
    .returning();
  return table ?? null;
}
