"use client";

export function PrintPlanButton() {
  return (
    <button
      type="button"
      ref={(button) => {
        if (!button) {
          return;
        }
        button.onclick = () => {
          window.print();
        };
      }}
      className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white"
    >
      Print
    </button>
  );
}
