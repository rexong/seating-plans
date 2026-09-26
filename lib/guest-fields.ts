export function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

export type ParsedGuestLine = {
  name: string;
  designation: string | null;
  organisation: string | null;
};

export function parseBulkGuestLine(line: string): ParsedGuestLine | null {
  const parts = line.split(";");
  if (parts.length !== 3) {
    return null;
  }

  const name = parts[0]?.trim() ?? "";
  if (name.length === 0) {
    return null;
  }

  return {
    name,
    designation: emptyToNull(parts[1] ?? ""),
    organisation: emptyToNull(parts[2] ?? ""),
  };
}

export function guestRoleLine(guest: {
  designation: string | null;
  organisation: string | null;
}): string {
  return [guest.designation, guest.organisation]
    .filter((part): part is string => Boolean(part))
    .join(" · ");
}
