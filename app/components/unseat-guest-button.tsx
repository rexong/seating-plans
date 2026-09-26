"use client";

type Props = {
  guestName: string;
  onUnseat: () => void;
};

export function UnseatGuestButton({ guestName, onUnseat }: Props) {
  return (
    <div className="absolute top-1 right-1">
      <button
        type="button"
        aria-label={`Unseat ${guestName}`}
        className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800 disabled:opacity-60"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onUnseat();
        }}
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="size-5" aria-hidden>
          <path
            fillRule="evenodd"
            d="M5.22 5.22a.75.75 0 0 1 1.06 0L10 8.94l3.72-3.72a.75.75 0 1 1 1.06 1.06L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06L10 11.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
