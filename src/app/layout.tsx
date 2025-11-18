import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WalletContextProvider } from "@/components/wallet-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DesignFi Studio | Hybrid Web2 & Web3 Creative Agency",
  description:
    "Hybrid Web2 & Web3 creative agency delivering elegant design systems, growth campaigns, and brand strategy for ambitious brands.",
  keywords: [
    "DesignFi Studio",
    "Web3 marketing agency",
    "crypto marketing",
    "branding studio",
    "Next.js agency site",
    "token launch marketing",
    "hybrid Web2 Web3 agency",
    "design and growth studio",
  ],
  metadataBase: new URL("https://designfi.studio"),
  openGraph: {
    title: "DesignFi Studio | Hybrid Web2 & Web3 Creative Agency",
    description:
      "Hybrid Web2 & Web3 creative agency delivering elegant design systems, growth campaigns, and brand strategy for ambitious brands.",
    url: "https://designfi.studio",
    type: "website",
    siteName: "DesignFi Studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "DesignFi Studio | Hybrid Web2 & Web3 Creative Agency",
    description:
      "Hybrid Web2 & Web3 creative agency delivering elegant design systems and growth campaigns for ambitious brands.",
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100`}
      >
        <WalletContextProvider>
          <div className="relative flex min-h-screen flex-col overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(120,46,255,0.25),_transparent_60%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(14,165,233,0.12),_transparent_55%)]" />
            <SiteHeader />
            <main className="relative z-10 flex-1">{children}</main>
            <SiteFooter />
          </div>
        </WalletContextProvider>
      </body>
    </html>
  );
}
