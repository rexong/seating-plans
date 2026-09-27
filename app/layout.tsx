import type { Metadata } from "next";
import { ToastProvider } from "@/app/components/toast-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Seat Planning",
  description: "Plan guests, tables, and seats for an event.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50 text-zinc-900 antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
