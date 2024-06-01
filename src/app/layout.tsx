import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  themeColor: "#000",
};

export const metadata: Metadata = {
  title: "Blog",
  description: "Blog template",

  icons: {
    icon: {
      url: "/favicon.ico",
    },
    shortcut: {
      url: "/favicon.ico",
    },
    apple: [
      {
        url: "/favicon.ico",
      },
    ],
  },

  openGraph: {
    title: "Blog",
    description: "Blog template",
    // url: "https://onasgroup.com.ar",
    siteName: "Blog",
    // images: [
    //   {
    //     url: "/social-media-card.png",
    //     width: 1200,
    //     height: 600,
    //   },
    // ],
    locale: "es-AR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Blog",
    description: "Blog template",
    // images: {
    //   url: "/social-media-card.png",
    // },
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
