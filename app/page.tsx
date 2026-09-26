import { connection } from "next/server";
import Link from "next/link";
import { CreateEventForm } from "@/app/components/create-event-form";
import { DeleteEventButton } from "@/app/components/delete-event-button";
import { listEvents } from "@/db/events";
import { pingDatabase } from "@/db/ping";

export default async function Home() {
  await connection();
  const status = await pingDatabase();

  let events: Awaited<ReturnType<typeof listEvents>> = [];
  let listError: string | null = null;

  if (status.ok) {
    try {
      events = await listEvents();
    } catch (error) {
      listError =
        error instanceof Error ? error.message : "Could not load events";
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-6 px-6 py-12">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase">
          Phase 2
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Seat Planning</h1>
        {status.ok ? (
          <p className="text-sm text-emerald-700">Database connected.</p>
        ) : (
          <p className="text-sm text-red-700">
            Database failed: {status.message}
          </p>
        )}
      </div>

      <CreateEventForm />

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Events</h2>
        {listError ? (
          <p className="text-red-700">Could not load events: {listError}</p>
        ) : !status.ok ? (
          <p className="text-zinc-600">
            Event list is unavailable until the database is reachable.
          </p>
        ) : events.length === 0 ? (
          <p className="text-zinc-600">No events yet.</p>
        ) : (
          <ul className="divide-y divide-zinc-200 rounded-md border border-zinc-200 bg-white">
            {events.map((event) => (
              <li
                key={event.id}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <Link
                  href={`/events/${event.shareToken}`}
                  className="font-medium text-zinc-900 underline-offset-2 hover:underline"
                >
                  {event.name}
                </Link>
                <DeleteEventButton
                  eventId={event.id}
                  eventName={event.name}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
