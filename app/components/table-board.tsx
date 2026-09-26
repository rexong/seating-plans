import { CreateTableButton } from "@/app/components/create-table-button";
import { DeleteTableButton } from "@/app/components/delete-table-button";

type EventTable = {
  id: string;
  label: string;
  seatCount: number;
};

type Props = {
  eventId: string;
  shareToken: string;
  tables: EventTable[];
  listError: string | null;
};

function EmptySeats({ count }: { count: number }) {
  return (
    <div className="flex flex-col gap-2 p-4">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="h-10 w-24 shrink-0 rounded-md border border-dashed border-zinc-300 bg-zinc-50"
          aria-label={`Seat ${index + 1}, empty`}
        />
      ))}
    </div>
  );
}

export function TableBoard({
  eventId,
  shareToken,
  tables,
  listError,
}: Props) {
  if (listError) {
    return (
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Tables</h2>
        <p className="text-red-700">Could not load tables: {listError}</p>
      </section>
    );
  }

  if (tables.length === 0) {
    return (
      <section className="flex flex-col items-start gap-4 rounded-md border border-dashed border-zinc-300 bg-white px-6 py-12">
        <h2 className="text-lg font-medium">Tables</h2>
        <p className="text-zinc-600">No tables yet. Create the first one.</p>
        <CreateTableButton
          eventId={eventId}
          shareToken={shareToken}
          label="Create a table"
        />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-medium">Tables</h2>
        <CreateTableButton
          eventId={eventId}
          shareToken={shareToken}
          label="Add another table"
        />
      </div>
      <div className="-mx-1 flex min-w-0 flex-row items-start gap-4 overflow-x-auto pb-2">
        {tables.map((table) => (
          <article
            key={table.id}
            className="w-max shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-white"
          >
            <header className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-2">
              <h3 className="font-medium text-zinc-900">{table.label}</h3>
              <DeleteTableButton
                eventId={eventId}
                shareToken={shareToken}
                tableId={table.id}
                tableLabel={table.label}
              />
            </header>
            <EmptySeats count={table.seatCount} />
          </article>
        ))}
      </div>
    </section>
  );
}
