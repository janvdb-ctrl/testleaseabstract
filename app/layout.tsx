import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "@/components/providers";
// KAD design tokens (:root) — load before Tailwind so vars exist for utilities & @apply
import "../globals.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lease Abstraction Agent — Obligations",
  description: "Property obligations overview",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="min-h-screen bg-[var(--colour-neutral-100)] font-neue-plak-text text-fs-16 font-regular leading-lh-24 text-[var(--colour-neutral-30)] antialiased"
        style={{ fontFamily: "var(--font-family-neue-plak-text)" }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
