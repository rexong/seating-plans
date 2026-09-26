export const TABLE_SEAT_COUNT = 10;

export function nextTableLabel(existingLabels: string[]) {
  let max = 0;
  for (const label of existingLabels) {
    const match = /^Table (\d+)$/.exec(label);
    if (match) {
      max = Math.max(max, Number(match[1]));
    }
  }
  return `Table ${max + 1}`;
}
