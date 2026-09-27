import { guestColourBorderClass } from "@/lib/guest-colours";

export const GUEST_CARD_CLASS =
  "flex min-h-14 w-full min-w-0 items-start gap-2 rounded-md bg-white px-3 py-2";

export const GUEST_CARD_EMPTY_CLASS = `${GUEST_CARD_CLASS} border border-dashed border-zinc-200 bg-zinc-50`;

export function guestCardShellClass(colour: string | null, extra = "") {
  return `${GUEST_CARD_CLASS} ${guestColourBorderClass(colour)} ${extra}`.trim();
}
