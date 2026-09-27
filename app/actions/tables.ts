"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getEventByShareToken } from "@/db/events";
import { createTable, deleteTableById } from "@/db/tables";
import { assertOperatorAuthorized } from "@/lib/request-auth";

const eventIdSchema = z.string().uuid();
const tableIdSchema = z.string().uuid();

export type TableActionState = { error?: string } | null;

async function assertAuthorized() {
  await assertOperatorAuthorized();
}

async function eventPath(eventId: string, shareToken: string) {
  const event = await getEventByShareToken(shareToken);
  if (!event || event.id !== eventId) {
    return null;
  }
  return event;
}

export async function createTableAction(
  _prev: TableActionState,
  formData: FormData,
): Promise<TableActionState> {
  await assertAuthorized();

  const eventId = eventIdSchema.safeParse(formData.get("eventId"));
  const shareToken = z.string().min(1).safeParse(formData.get("shareToken"));

  if (!eventId.success || !shareToken.success) {
    return { error: "Invalid event" };
  }

  const event = await eventPath(eventId.data, shareToken.data);
  if (!event) {
    return { error: "Event not found" };
  }

  await createTable(event.id);
  revalidatePath(`/events/${event.shareToken}`);
  return null;
}

export async function deleteTableAction(
  _prev: TableActionState,
  formData: FormData,
): Promise<TableActionState> {
  await assertAuthorized();

  const eventId = eventIdSchema.safeParse(formData.get("eventId"));
  const shareToken = z.string().min(1).safeParse(formData.get("shareToken"));
  const tableId = tableIdSchema.safeParse(formData.get("id"));

  if (!eventId.success || !shareToken.success || !tableId.success) {
    return { error: "Invalid table" };
  }

  const event = await eventPath(eventId.data, shareToken.data);
  if (!event) {
    return { error: "Event not found" };
  }

  // ON DELETE SET NULL unseats guests on this table.
  await deleteTableById(event.id, tableId.data);
  revalidatePath(`/events/${event.shareToken}`);
  return null;
}
