import { connection } from "next/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GuestSidebar } from "@/app/components/guest-list";
import { TableBoard } from "@/app/components/table-board";
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
    <main className="mx-auto flex min-h-screen w-full max-w-none flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase">
          Phase 4
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{event.name}</h1>
        <Link
          href="/"
          className="text-sm font-medium text-zinc-900 underline-offset-2 hover:underline"
        >
          Back to events
        </Link>
      </div>
      <div className="grid min-w-0 gap-8 md:grid-cols-[16rem_minmax(0,1fr)]">
        <GuestSidebar
          eventId={event.id}
          shareToken={event.shareToken}
          guests={guests}
          listError={guestError}
        />
        <TableBoard
          eventId={event.id}
          shareToken={event.shareToken}
          tables={eventTables}
          listError={tableError}
        />
      </div>
    </main>
  );
}
