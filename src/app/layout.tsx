import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import { IBM_Plex_Mono, Syne } from "next/font/google";
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
  title: "acct - Switch GitHub accounts by folder",
  description:
    "Bind a directory to a GitHub user, email, and token. Enter the folder and that account is active. Leave and it is gone.",
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "acct",
    description: "Switch GitHub accounts by folder. Automatically.",
    type: "website",
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
