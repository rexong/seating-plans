export const GUEST_COLOURS = [
  "rose",
  "amber",
  "emerald",
  "sky",
  "violet",
  "zinc",
] as const;

export type GuestColour = (typeof GUEST_COLOURS)[number];

const COLOUR_LABELS: Record<GuestColour, string> = {
  rose: "Rose",
  amber: "Amber",
  emerald: "Emerald",
  sky: "Sky",
  violet: "Violet",
  zinc: "Zinc",
};

const COLOUR_DOT: Record<GuestColour, string> = {
  rose: "bg-rose-500",
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
  zinc: "bg-zinc-500",
};

export function isGuestColour(value: string): value is GuestColour {
  return (GUEST_COLOURS as readonly string[]).includes(value);
}

export function guestColourLabel(colour: string | null) {
  if (!colour || !isGuestColour(colour)) {
    return "None";
  }
  return COLOUR_LABELS[colour];
}

export function guestColourDotClass(colour: string | null) {
  if (!colour || !isGuestColour(colour)) {
    return "border border-zinc-300 bg-white";
  }
  return COLOUR_DOT[colour];
}
