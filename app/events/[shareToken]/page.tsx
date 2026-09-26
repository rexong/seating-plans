import { connection } from "next/server";
import { notFound } from "next/navigation";
import { EventSeating } from "@/app/components/event-seating";
import { getEventByShareToken } from "@/db/events";
import { listGuestsForEvent } from "@/db/guests";
import { listTablesForEvent } from "@/db/tables";

export default async function EventPage(
  props: PageProps<"/events/[shareToken]">,
) {
  await connection();
  const { shareToken } = await props.params;
  const event = await getEventByShareToken(shareToken);

  if (!event) {
    notFound();
  }

  let guests: Awaited<ReturnType<typeof listGuestsForEvent>> = [];
  let guestError: string | null = null;
  let eventTables: Awaited<ReturnType<typeof listTablesForEvent>> = [];
  let tableError: string | null = null;

  try {
    guests = await listGuestsForEvent(event.id);
  } catch (error) {
    guestError =
      error instanceof Error ? error.message : "Could not load guests";
  }

  try {
    eventTables = await listTablesForEvent(event.id);
  } catch (error) {
    tableError =
      error instanceof Error ? error.message : "Could not load tables";
  }

  return (
    <main className="flex h-dvh w-full max-w-none overflow-hidden px-6 py-4">
      <EventSeating
        eventId={event.id}
        shareToken={event.shareToken}
        eventName={event.name}
        guests={guests}
        tables={eventTables}
        guestError={guestError}
        tableError={tableError}
      />
    </main>
  );
}
