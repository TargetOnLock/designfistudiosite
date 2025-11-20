import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crypto Marketing Services | Token Launch & Web3 Growth | DesignFi Studio",
  description:
    "Marketing designed specifically for tokens, NFTs, and Web3 brands. Token branding, launch marketing, community growth, trending campaigns, and influencer outreach for crypto projects.",
  keywords: [
    "crypto marketing",
    "token marketing",
    "Web3 marketing",
    "NFT marketing",
    "token launch",
    "crypto branding",
    "blockchain marketing",
    "token trending",
    "DexTools trending",
    "crypto community management",
    "KOL campaigns",
    "crypto influencer marketing",
    "token website",
    "whitepaper writing",
    "DesignFi Studio",
  ],
  openGraph: {
    title: "Crypto Marketing Services | Token Launch & Web3 Growth | DesignFi Studio",
    description:
      "Marketing designed specifically for tokens, NFTs, and Web3 brands — from branding to trending to community growth.",
    url: "https://designfi.studio/crypto-marketing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crypto Marketing Services | DesignFi Studio",
    description: "Accelerate your crypto project with proven Web3 growth strategies.",
  },
  alternates: {
    canonical: "https://designfi.studio/crypto-marketing",
  },
};

const offerings = [
  {
    title: "Token Branding",
    items: [
      "Token logo + branding kit",
      "Token website",
      "Whitepaper writing",
      "Tokenomics consultation",
    ],
  },
  {
    title: "Launch Marketing",
    items: [
      "Pump launches",
      "Pre-launch hype content",
      "Launch graphics",
      "Trending campaigns",
      "Exchange & listing support",
    ],
  },
  {
    title: "Growth & Community",
    items: [
      "Telegram community management",
      "Mods & automation setup",
      "Social media growth",
      "Web3 influencer / KOL campaigns",
      "Discord setup + bots",
    ],
  },
  {
    title: "Advertising & Promotions",
    items: [
      "DexTools trending",
      "DexScreener updates",
      "CoinVote / WatcherGuru pushes",
      "AMA setup",
      "Press releases to crypto media",
    ],
  },
  {
    title: "NFT Marketing",
    items: [
      "NFT branding concepts",
      "Collection storyline",
      "Minting website",
      "Community hype content",
    ],
  },
];

const packages = [
  {
    title: "🚀 Token Starter Pack",
    price: "$199",
    subtitle: "Perfect for small or new projects.",
    features: [
      "Logo + banner",
      "Token page",
      "5 marketing graphics",
      "Telegram setup",
    ],
  },
  {
    title: "🔥 Web3 Growth Package",
    price: "$499–$1,499",
    subtitle: "A full push toward growth.",
    features: [
      "Full branding kit",
      "Website + whitepaper",
      "Social media setup",
      "Influencer outreach",
      "Community growth",
      "Small trending campaigns",
    ],
  },
  {
    title: "💎 Ultimate Hype Package",
    price: "Custom",
    subtitle: "For large-scale launches or serious projects. Includes everything + trending every week.",
    features: [
      "Dedicated strategist + mods",
      "Weekly trending & PR pushes",
      "KOL + paid media orchestration",
      "Advanced analytics dashboard",
    ],
  },
];

const reasons = [
  "We specialize in both IRL brands and crypto/Web3.",
  "24/7 Telegram support.",
  "Real growth (no botted numbers).",
  "We stay updated with trends.",
  "Full transparency and analytics.",
  "Creative and technical under one roof.",
];

export default function CryptoMarketingPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="max-w-3xl space-y-5">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-300">
          Crypto Marketing Services
        </p>
        <h1 className="text-4xl font-semibold text-white">
          Accelerate Your Crypto Project With Proven Web3 Growth Strategies
        </h1>
        <p className="text-lg text-slate-300">
          Marketing designed specifically for tokens, NFTs, and Web3 brands —
          from branding to trending to community growth.
        </p>
      </div>

      <section className="mt-12 space-y-8">
        <h2 className="text-2xl font-semibold text-white">
          🔥 What We Offer (Crypto-Specific)
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {offerings.map((offer) => (
            <div
              key={offer.title}
              className="rounded-3xl border border-white/10 bg-slate-900/60 p-6"
            >
              <h3 className="text-xl font-semibold text-white">
                ✔ {offer.title}
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {offer.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-violet-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 space-y-10">
        <h2 className="text-2xl font-semibold text-white">
          Crypto Marketing Packages
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {packages.map((pack) => (
            <div
              key={pack.title}
              className="flex flex-col rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-6"
            >
              <p className="text-lg font-semibold text-white">{pack.title}</p>
              <p className="mt-2 text-3xl font-bold text-white">{pack.price}</p>
              <p className="mt-2 text-sm text-slate-300">{pack.subtitle}</p>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-200">
                {pack.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-fuchsia-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/contact"
                className="mt-6 inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white"
              >
                Start My Crypto Marketing
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-2xl font-semibold text-white">
          Why Choose DesignFi Studio for Crypto Marketing?
        </h2>
        <ul className="mt-6 grid gap-3 text-slate-200 md:grid-cols-2">
          {reasons.map((reason) => (
            <li
              key={reason}
              className="flex items-start gap-3 rounded-2xl border border-white/5 bg-black/30 p-4"
            >
              <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 rounded-3xl border border-violet-400/40 bg-gradient-to-r from-violet-600/40 via-fuchsia-600/30 to-slate-900/50 p-8 text-white shadow-[0_35px_90px_rgba(76,29,149,0.35)]">
        <p className="text-sm uppercase tracking-[0.3em] text-white/80">
          CTA · Crypto Marketing
        </p>
        <h2 className="mt-4 text-3xl font-semibold">
          Ready to Promote Your Token or Web3 Brand?
        </h2>
        <p className="mt-3 text-slate-50">
          Choose how to reach us: DM on Telegram (fastest), X (Twitter), email, or drop a
          note via the website contact form.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <a
            href="https://t.me/DesignFiStudio"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900"
          >
            Join Telegram Channel
          </a>
          <a
            href="https://x.com/DesignFiStudio"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white"
          >
            X (Twitter)
          </a>
          <a
            href="mailto:blaine@designfi.studio"
            className="rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white"
          >
            Email the Team
          </a>
          <a
            href="/contact"
            className="rounded-full border border-white/0 bg-black/40 px-6 py-3 text-sm font-semibold text-white"
          >
            Start My Crypto Marketing
          </a>
        </div>
      </section>
    </div>
  );
}

