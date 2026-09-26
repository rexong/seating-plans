"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getEventByShareToken } from "@/db/events";
import {
  createGuest,
  createGuests,
  deleteGuestById,
  updateGuestColour,
} from "@/db/guests";
import { isBasicAuthorized } from "@/lib/basic-auth";
import { GUEST_COLOURS } from "@/lib/guest-colours";

const guestNameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(120, "Name is too long");

const colourSchema = z
  .string()
  .optional()
  .transform((value) => {
    if (!value || value === "none") {
      return null;
    }
    return value;
  })
  .pipe(z.enum(GUEST_COLOURS).nullable());

const eventIdSchema = z.string().uuid();
const guestIdSchema = z.string().uuid();

export type GuestActionState = { error?: string } | null;

async function assertAuthorized() {
  const headerList = await headers();
  if (!isBasicAuthorized(headerList.get("authorization"))) {
    throw new Error("Unauthorized");
  }
}

async function eventPath(eventId: string, shareToken: string) {
  const event = await getEventByShareToken(shareToken);
  if (!event || event.id !== eventId) {
    return null;
  }
  return event;
}

export async function createGuestAction(
  _prev: GuestActionState,
  formData: FormData,
): Promise<GuestActionState> {
  await assertAuthorized();

  const eventId = eventIdSchema.safeParse(formData.get("eventId"));
  const shareToken = z.string().min(1).safeParse(formData.get("shareToken"));
  const name = guestNameSchema.safeParse(formData.get("name"));

  if (!eventId.success || !shareToken.success) {
    return { error: "Invalid event" };
  }
  if (!name.success) {
    return { error: name.error.issues[0]?.message ?? "Invalid name" };
  }

  const event = await eventPath(eventId.data, shareToken.data);
  if (!event) {
    return { error: "Event not found" };
  }

  await createGuest({
    eventId: event.id,
    name: name.data,
  });
  revalidatePath(`/events/${event.shareToken}`);
  return null;
}

export async function createGuestsBulkAction(
  _prev: GuestActionState,
  formData: FormData,
): Promise<GuestActionState> {
  await assertAuthorized();

  const eventId = eventIdSchema.safeParse(formData.get("eventId"));
  const shareToken = z.string().min(1).safeParse(formData.get("shareToken"));
  const rawNames = typeof formData.get("names") === "string"
    ? String(formData.get("names"))
    : "";
  const names = rawNames
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (!eventId.success || !shareToken.success) {
    return { error: "Invalid event" };
  }
  if (names.length === 0) {
    return { error: "Paste at least one name" };
  }
  if (names.length > 200) {
    return { error: "Too many names in one batch" };
  }

  const parsedNames = z.array(guestNameSchema).safeParse(names);
  if (!parsedNames.success) {
    return { error: "One or more names are invalid" };
  }

  const event = await eventPath(eventId.data, shareToken.data);
  if (!event) {
    return { error: "Event not found" };
  }

  await createGuests({
    eventId: event.id,
    names: parsedNames.data,
  });
  revalidatePath(`/events/${event.shareToken}`);
  return null;
}

export async function deleteGuestAction(
  _prev: GuestActionState,
  formData: FormData,
): Promise<GuestActionState> {
  await assertAuthorized();

  const eventId = eventIdSchema.safeParse(formData.get("eventId"));
  const shareToken = z.string().min(1).safeParse(formData.get("shareToken"));
  const guestId = guestIdSchema.safeParse(formData.get("id"));

  if (!eventId.success || !shareToken.success || !guestId.success) {
    return { error: "Invalid guest" };
  }

  const event = await eventPath(eventId.data, shareToken.data);
  if (!event) {
    return { error: "Event not found" };
  }

  await deleteGuestById(event.id, guestId.data);
  revalidatePath(`/events/${event.shareToken}`);
  return null;
}

export async function updateGuestColourAction(input: {
  eventId: string;
  shareToken: string;
  guestId: string;
  colour: string | null;
}): Promise<GuestActionState> {
  await assertAuthorized();

  const eventId = eventIdSchema.safeParse(input.eventId);
  const shareToken = z.string().min(1).safeParse(input.shareToken);
  const guestId = guestIdSchema.safeParse(input.guestId);
  const colour = colourSchema.safeParse(input.colour ?? "none");

  if (!eventId.success || !shareToken.success || !guestId.success) {
    return { error: "Invalid guest" };
  }
  if (!colour.success) {
    return { error: "Invalid colour" };
  }

  const event = await eventPath(eventId.data, shareToken.data);
  if (!event) {
    return { error: "Event not found" };
  }

  const guest = await updateGuestColour(event.id, guestId.data, colour.data);
  if (!guest) {
    return { error: "Guest not found" };
  }

  revalidatePath(`/events/${event.shareToken}`);
  return null;
}
