import Link from "next/link";
import { GuestCardFace, GUEST_CARD_CLASS } from "@/app/components/guest-card";
import { PrintPlanButton } from "@/app/components/print-plan-button";
import {
  guestAssignmentLabel,
  guestBySeat,
  type SeatingGuest,
} from "@/lib/seating";

type EventTable = {
  id: string;
  label: string;
  seatCount: number;
};

type Props = {
  shareToken: string;
  eventName: string;
  guests: SeatingGuest[];
  tables: EventTable[];
  guestError: string | null;
  tableError: string | null;
};

export function SeatingExport({
  shareToken,
  eventName,
  guests,
  tables,
  guestError,
  tableError,
}: Props) {
  const tableLabels = Object.fromEntries(
    tables.map((table) => [table.id, table.label]),
  );
  const eventHref = `/events/${shareToken}`;

  return (
    <div className="mx-auto flex w-full max-w-none flex-col gap-6 px-8 py-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
            {eventName}
          </h1>
          <p className="mt-1 text-sm text-zinc-600">Seating plan</p>
        </div>
        <div className="no-print flex flex-col items-end gap-2">
          <div className="flex items-center gap-3">
            <Link
              href={eventHref}
              className="text-sm font-medium text-zinc-900 underline-offset-2 hover:underline"
            >
              Back to seating
            </Link>
            {tables.length > 0 && !tableError ? <PrintPlanButton /> : null}
          </div>
          <p className="text-xs text-zinc-500">
            Or use Ctrl+P / ⌘P if Print is blocked in this browser.
          </p>
        </div>
      </header>

      {tableError ? (
        <p className="text-red-700">Could not load tables: {tableError}</p>
      ) : guestError ? (
        <p className="text-red-700">Could not load guests: {guestError}</p>
      ) : tables.length === 0 ? (
        <p className="text-zinc-600">No tables on this event yet.</p>
      ) : (
        <section className="grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-6">
          {tables.map((table) => (
            <article
              key={table.id}
              className="export-table min-w-0 overflow-hidden rounded-md border border-zinc-200 bg-white"
            >
              <header className="border-b border-zinc-200 px-4 py-2">
                <h2 className="font-medium text-zinc-900">{table.label}</h2>
              </header>
              <div className="flex flex-col gap-2 p-3">
                {Array.from({ length: table.seatCount }, (_, index) => {
                  const seatIndex = index + 1;
                  const guest = guestBySeat(guests, table.id, seatIndex);
                  const assignment = guest
                    ? guestAssignmentLabel(guest, tableLabels)
                    : "";

                  return (
                    <div key={seatIndex} className="flex items-start gap-2">
                      <span
                        className="mt-2.5 w-5 shrink-0 text-center text-xs font-medium text-zinc-500"
                        aria-hidden
                      >
                        {seatIndex}
                      </span>
                      {guest ? (
                        <div className={`${GUEST_CARD_CLASS}`}>
                          <GuestCardFace
                            guest={guest}
                            assignment={assignment}
                            wrapAssignment
                          />
                        </div>
                      ) : (
                        <div
                          className={`${GUEST_CARD_CLASS} border-dashed bg-zinc-50`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
