"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createEvent, deleteEventById } from "@/db/events";
import { isBasicAuthorized } from "@/lib/basic-auth";

const eventNameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(120, "Name is too long");

const eventIdSchema = z.string().uuid();

export type EventActionState = { error?: string } | null;

async function assertAuthorized() {
  const headerList = await headers();
  if (!isBasicAuthorized(headerList.get("authorization"))) {
    throw new Error("Unauthorized");
  }
}

export async function createEventAction(
  _prev: EventActionState,
  formData: FormData,
): Promise<EventActionState> {
  await assertAuthorized();

  const parsed = eventNameSchema.safeParse(formData.get("name"));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid name" };
  }

  await createEvent(parsed.data);
  revalidatePath("/");
  return null;
}

export async function deleteEventAction(
  _prev: EventActionState,
  formData: FormData,
): Promise<EventActionState> {
  await assertAuthorized();

  const parsed = eventIdSchema.safeParse(formData.get("id"));
  if (!parsed.success) {
    return { error: "Invalid event" };
  }

  const deleted = await deleteEventById(parsed.data);
  if (deleted) {
    revalidatePath("/");
    revalidatePath(`/events/${deleted.shareToken}`);
  }
  return null;
}
