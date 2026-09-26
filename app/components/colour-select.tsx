import { GUEST_COLOURS, guestColourLabel } from "@/lib/guest-colours";

type Props = {
  id: string;
  name?: string;
  defaultValue?: string;
};

export function ColourSelect({ id, name = "colour", defaultValue = "none" }: Props) {
  return (
    <select
      id={id}
      name={name}
      defaultValue={defaultValue}
      className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
    >
      <option value="none">None</option>
      {GUEST_COLOURS.map((colour) => (
        <option key={colour} value={colour}>
          {guestColourLabel(colour)}
        </option>
      ))}
    </select>
  );
}
