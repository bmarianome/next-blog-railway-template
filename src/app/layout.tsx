import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import { env } from "~/env";

export const viewport: Viewport = {
  width: "device-width",
  themeColor: "#000",
};

const faviconUrl = env.FAVICON_URL ?? "/favicon.ico";
const blogTitle = env.BLOG_TITLE;
const blogDescription = env.BLOG_DESCRIPTION;

export const metadata: Metadata = {
  title: blogTitle,
  description: blogDescription,

  icons: {
    icon: { url: faviconUrl },
    shortcut: { url: faviconUrl },
    apple: [{ url: faviconUrl }],
  },

  openGraph: {
    title: blogTitle,
    description: blogDescription,
    siteName: blogTitle,
    locale: "es-AR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: blogTitle,
    description: blogDescription,
  },

  authors: [{ name: "bmariano", url: "https://bmariano.me" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
