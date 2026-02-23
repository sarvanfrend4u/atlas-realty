import type { Metadata, Viewport } from "next";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atlas Realty — Map-First Property Search, Chennai",
  description:
    "Discover properties on an interactive map. Chennai real estate search powered by open-source tools.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#007AFF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN">
      <body className="antialiased bg-[#E8E0D8] overflow-hidden">{children}</body>
    </html>
  );
}
