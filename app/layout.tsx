import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/lib/data";
import { siteUrl } from "@/lib/site";

const sans = Inter({ subsets: ["latin"], variable: "--nf-sans", display: "swap" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--nf-display", display: "swap" });
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--nf-serif",
  display: "swap",
});
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--nf-mono", display: "swap" });

const title = `${profile.name} | ${profile.role}`;

// The Open Graph image comes from app/opengraph-image.tsx (Next adds the og:image tags).
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description: profile.tagline,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description: profile.tagline,
    type: "profile",
    url: "/",
    siteName: profile.name,
    firstName: profile.firstName,
    lastName: profile.lastName,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: profile.tagline,
  },
};

export const viewport: Viewport = {
  themeColor: "#060708",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} ${serif.variable} ${mono.variable}`}
    >
      <body className="grain">{children}</body>
    </html>
  );
}
