import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
      </head>
      <body className="bg-surface-dark text-slate-100 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
