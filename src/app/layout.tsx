import type { Metadata } from "next";

import "./globals.css";

// Preserve the Story 5.1 Inter / Noto Serif pairing via CSS fallbacks in this
// network-restricted workspace instead of fetching remote fonts at build time.

export const metadata: Metadata = {
  title: "Albemarle Pulse",
  description: "Venue display for Royal Institution departure reading.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
