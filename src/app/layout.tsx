import type { Metadata } from "next";

import { getPublicDisplayShellMetadata } from "@/features/display-shell/presenter";

import "./globals.css";

const shellMetadata = getPublicDisplayShellMetadata();

export const metadata: Metadata = shellMetadata;

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
