"use client";

import { useState } from "react";

type Props = {
  href: string;
};

export function BackToSeatingButton({ href }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function goIfSignedIn() {
    const response = await fetch("/api/session", { method: "GET" });
    return response.ok;
  }

  async function onClick() {
    if (pending) {
      return;
    }
    setPending(true);
    setError(null);
    try {
      if (await goIfSignedIn()) {
        window.location.assign(href);
        return;
      }
      setOpen(true);
    } finally {
      setPending(false);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: String(form.get("user") ?? ""),
          password: String(form.get("password") ?? ""),
        }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(payload?.error ?? "Could not sign in");
        return;
      }
      window.location.assign(href);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={pending && !open}
        className="text-sm font-medium text-zinc-900 underline-offset-2 hover:underline disabled:opacity-60"
      >
        Back to seating
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 px-4"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget && !pending) {
              setOpen(false);
              setError(null);
            }
          }}
        >
          <form
            onSubmit={onSubmit}
            role="dialog"
            aria-modal="true"
            aria-labelledby="back-to-seating-title"
            className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg"
          >
            <h2 id="back-to-seating-title" className="text-lg font-medium">
              Sign in to edit seating
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Cancel stays on this export page.
            </p>
            <label className="pointer-events-auto mt-4 block text-sm font-medium text-zinc-700" htmlFor="seating-user">
              Username
            </label>
            <input
              id="seating-user"
              name="user"
              type="text"
              autoComplete="username"
              required
              className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
            />
            <label
              className="pointer-events-auto mt-3 block text-sm font-medium text-zinc-700"
              htmlFor="seating-password"
            >
              Password
            </label>
            <input
              id="seating-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
            />
            {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  setOpen(false);
                  setError(null);
                }}
                className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={pending}
                className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {pending ? "Signing in…" : "Continue"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
