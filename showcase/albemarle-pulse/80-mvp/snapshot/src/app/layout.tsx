import type { Metadata } from "next";
import { Inter, Noto_Serif } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-headline",
  weight: ["400", "500", "700"],
});

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
      <body className={`${inter.variable} ${notoSerif.variable}`}>{children}</body>
    </html>
  );
}
