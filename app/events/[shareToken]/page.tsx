import { connection } from "next/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventByShareToken } from "@/db/events";

export default async function EventPage(
  props: PageProps<"/events/[shareToken]">,
) {
  await connection();
  const { shareToken } = await props.params;
  const event = await getEventByShareToken(shareToken);

  if (!event) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-4 px-6">
      <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase">
        Phase 2
      </p>
      <h1 className="text-3xl font-semibold tracking-tight">{event.name}</h1>
      <p className="text-zinc-600">
        Guests and tables land in later phases. This event is isolated by its
        share URL.
      </p>
      <Link
        href="/"
        className="text-sm font-medium text-zinc-900 underline-offset-2 hover:underline"
      >
        Back to events
      </Link>
    </main>
  );
}
