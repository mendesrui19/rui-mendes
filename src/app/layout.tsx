import type { Metadata, Viewport } from "next";
import { Outfit, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import RefreshRedirect from "@/components/RefreshRedirect";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
});

export const metadata: Metadata = {
  title: "Rui Mendes — Data Science & Engineering",
  description:
    "Rui Mendes portfolio. Master’s in Data Science and Engineering at FEUP. Web products, admin panels and data systems.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#14241c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <body className={outfit.className} suppressHydrationWarning>
        <RefreshRedirect />
        {children}
      </body>
    </html>
  );
}
