import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Clear Drain — Civic Drain Issue Tracker",
    template: "%s | Clear Drain",
  },
  description:
    "Report drain blockages, track sanitation issues, and monitor resolution progress across your city with Clear Drain — the AI-powered civic maintenance platform.",
  keywords: ["drain cleaning", "civic maintenance", "sanitation", "blockage report", "municipality"],
  openGraph: {
    title: "Clear Drain — Civic Drain Issue Tracker",
    description: "AI-powered civic drain maintenance and issue tracking platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${outfit.variable} ${jetBrainsMono.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
      </head>
      <body className="bg-surface-dark text-slate-100 font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
