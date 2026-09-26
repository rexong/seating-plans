type Props = {
  title: string;
  description: string;
  confirmLabel: string;
  pending: boolean;
  error?: string;
  onCancel: () => void;
};

export function ConfirmModal({
  title,
  description,
  confirmLabel,
  pending,
  error,
  onCancel,
}: Props) {
  const titleId = `${title.toLowerCase().replace(/\s+/g, "-")}-title`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 px-4"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget && !pending) {
          onCancel();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg"
      >
        <h2 id={titleId} className="text-lg font-medium">
          {title}
        </h2>
        <p className="mt-1 text-sm text-zinc-600">{description}</p>
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={onCancel}
            className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-red-700 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {pending ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
