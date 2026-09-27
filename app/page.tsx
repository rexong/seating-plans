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
          <div className="flex flex-col items-start gap-3 rounded-md border border-dashed border-zinc-300 bg-white px-4 py-5">
            <p className="text-sm text-zinc-700">
              No events yet. Create one with the form above — each event gets
              its own guest list, tables, and shareable seating URL.
            </p>
            <a
              href="#event-name"
              className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white"
            >
              Name your first event
            </a>
          </div>
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
