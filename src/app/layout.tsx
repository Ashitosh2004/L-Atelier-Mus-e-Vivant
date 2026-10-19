import type { Metadata } from "next";
import "./globals.css";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/800.css";
import "@fontsource/playfair-display/400-italic.css";
import "@fontsource/playfair-display/500-italic.css";
import "@fontsource/cormorant-garamond/300.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/300-italic.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource/manrope/300.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";

export const metadata: Metadata = {
  title: "L'Atelier — Musée Vivant | A Living Museum of Timeless Art",
  description:
    "Step into L'Atelier, a living museum spanning five centuries of masterworks — Renaissance, Baroque, Impressionism, Art Nouveau and classical Sculpture, reimagined for the modern eye.",
  keywords: [
    "museum",
    "art gallery",
    "renaissance",
    "baroque",
    "impressionism",
    "art nouveau",
    "sculpture",
    "digital museum",
  ],
  authors: [{ name: "L'Atelier" }],
  openGraph: {
    title: "L'Atelier — Musée Vivant",
    description:
      "Five centuries of masterworks, reimagined for the modern eye. A living museum of timeless art.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-ink text-parchment">{children}</body>
    </html>
  );
}
