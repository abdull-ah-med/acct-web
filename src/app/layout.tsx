import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import { IBM_Plex_Mono, Syne } from "next/font/google";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.github }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "technology",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: "/logo.svg",
        width: 1024,
        height: 1024,
        alt: "acct logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const bodyFontStyle = {
  "--font-body":
    '"SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif',
} as CSSProperties;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="bound"
      className={`${syne.variable} ${ibmPlexMono.variable} dark h-full`}
      style={bodyFontStyle}
    >
      <body className="min-h-full grain">{children}</body>
    </html>
  );
}
