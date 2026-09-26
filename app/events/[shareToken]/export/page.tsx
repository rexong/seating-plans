import { connection } from "next/server";
import { notFound } from "next/navigation";
import { SeatingExport } from "@/app/components/seating-export";
import { getEventByShareToken } from "@/db/events";
import { listGuestsForEvent } from "@/db/guests";
import { listTablesForEvent } from "@/db/tables";

export default async function EventExportPage(
  props: PageProps<"/events/[shareToken]/export">,
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
    <main className="min-h-dvh w-full bg-zinc-50">
      <SeatingExport
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
