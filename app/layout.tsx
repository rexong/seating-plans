import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Seat Planning",
  description: "Plan guests, tables, and seats for an event.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50 text-zinc-900 antialiased">
        {children}
      </body>
    </html>
  );
}
