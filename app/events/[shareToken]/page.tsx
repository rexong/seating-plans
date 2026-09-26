import { connection } from "next/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GuestWorkspace } from "@/app/components/guest-list";
import { getEventByShareToken } from "@/db/events";
import { listGuestsForEvent } from "@/db/guests";

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
  let listError: string | null = null;

  try {
    guests = await listGuestsForEvent(event.id);
  } catch (error) {
    listError =
      error instanceof Error ? error.message : "Could not load guests";
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase">
          Phase 3
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{event.name}</h1>
        <Link
          href="/"
          className="text-sm font-medium text-zinc-900 underline-offset-2 hover:underline"
        >
          Back to events
        </Link>
      </div>
      <GuestWorkspace
        eventId={event.id}
        shareToken={event.shareToken}
        guests={guests}
        listError={listError}
      />
    </main>
  );
}
