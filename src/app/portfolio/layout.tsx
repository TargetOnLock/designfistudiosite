import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio | Branding, Websites, Crypto & NFT Projects | DesignFi Studio",
  description:
    "Browse our portfolio of brand systems, web experiences, campaign suites, crypto launches, and NFT drops. Multi-industry work with a focus on conversion and community.",
  keywords: [
    "DesignFi Studio portfolio",
    "branding portfolio",
    "web design portfolio",
    "crypto project portfolio",
    "NFT design portfolio",
    "marketing campaigns",
    "brand identity",
    "website design",
    "token launch",
    "NFT collection",
  ],
  openGraph: {
    title: "Portfolio | Branding, Websites, Crypto & NFT Projects | DesignFi Studio",
    description:
      "Multi-industry work with a focus on conversion and community.",
    url: "https://designfi.studio/portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | DesignFi Studio",
    description: "Multi-industry work with a focus on conversion and community.",
  },
  alternates: {
    canonical: "https://designfi.studio/portfolio",
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

