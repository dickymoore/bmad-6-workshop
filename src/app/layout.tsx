import type { Metadata } from "next";

import "./globals.css";

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
