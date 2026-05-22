import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atlas — Your Personal Intelligence Feed",
  description: "Everything the web knows, ranked for you. A Google Discover replacement for power users.",
  keywords: ["knowledge", "RSS", "AI", "reading", "personal", "intelligence"],
  authors: [{ name: "Chirag Singhal" }],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/icon-192.svg",
    apple: "/icons/icon-512.svg",
  },
  openGraph: {
    title: "Atlas",
    description: "Your personal intelligence feed",
    url: "https://atlas.oriz.in",
    siteName: "Atlas",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "hsl(220, 22%, 4%)",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Newsreader:opsz,wght@6..72,400;6..72,600&family=JetBrains+Mono:wght@400;500&family=DM+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-atlas-bg-primary text-atlas-text-primary min-h-screen">
        {children}
      </body>
    </html>
  );
}
