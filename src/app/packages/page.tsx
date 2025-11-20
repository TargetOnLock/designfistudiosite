import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Packages & Pricing | Custom IRL & Crypto Marketing Packages | DesignFi Studio",
  description:
    "Bespoke packages for IRL services and crypto marketing. Custom brand launch kits, growth retainers, token sprints, and Web3 accelerator packages tailored to your goals.",
  keywords: [
    "marketing packages",
    "crypto marketing packages",
    "brand launch kit",
    "growth retainer",
    "token sprint",
    "Web3 accelerator",
    "custom marketing",
    "pricing",
    "marketing services",
    "DesignFi Studio",
  ],
  openGraph: {
    title: "Packages & Pricing | Custom IRL & Crypto Marketing Packages | DesignFi Studio",
    description:
      "Bespoke packages for IRL services and crypto pushes. Every engagement begins with a discovery and roadmap.",
    url: "https://designfi.studio/packages",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Packages & Pricing | DesignFi Studio",
    description: "Bespoke packages for IRL services and crypto marketing.",
  },
  alternates: {
    canonical: "https://designfi.studio/packages",
  },
};

const irlPackages = [
  {
    name: "Brand Launch Kit",
    note: "Scope finalized after discovery sprint.",
    items: [
      "Brand strategy intensive",
      "Logo suite + mini guidelines",
      "One-page site or landing page",
      "Campaign-ready social templates",
    ],
  },
  {
    name: "Growth Retainer",
    note: "Monthly retainers tailored to your media mix.",
    items: [
      "Paid media management",
      "Content + lifecycle marketing",
      "Analytics + reporting",
      "Creative refresh every quarter",
    ],
  },
];

const cryptoPackages = [
  {
    name: "Token Sprint",
    note: "Ideal for fast-turn launches; custom deliverables.",
    items: [
      "Brand kit + token page",
      "2-week content push",
      "Telegram mod setup",
      "Listing + PR guidance",
    ],
  },
  {
    name: "Web3 Accelerator",
    note: "Mix and match influencer, trending, and community ops.",
    items: [
      "Full campaign calendar",
      "Influencer + KOL outreach",
      "Trending campaign setup",
      "Weekly analytics + AMA support",
    ],
  },
];

export default function PackagesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
          Packages
        </p>
        <h1 className="text-4xl font-semibold text-white">
          Bespoke packages for IRL services and crypto pushes.
        </h1>
        <p className="text-lg text-slate-300">
          Every engagement begins with a discovery and roadmap. We scope
          timelines, deliverables, and investment levels together so each plan
          fits your exact goals.
        </p>
      </div>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <section>
          <h2 className="text-xl font-semibold text-white">
            IRL Service Packages
          </h2>
          <div className="mt-4 space-y-6">
            {irlPackages.map((pack) => (
              <div
                key={pack.name}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <p className="text-lg font-semibold text-white">{pack.name}</p>
                <p className="mt-1 text-sm text-violet-200">{pack.note}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {pack.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white">
            Crypto Service Packages
          </h2>
          <div className="mt-4 space-y-6">
            {cryptoPackages.map((pack) => (
              <div
                key={pack.name}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <p className="text-lg font-semibold text-white">{pack.name}</p>
                <p className="mt-1 text-sm text-fuchsia-200">{pack.note}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {pack.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-fuchsia-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="mt-12 rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 p-8 text-white">
        <h3 className="text-2xl font-semibold">Need a custom offer?</h3>
        <p className="mt-3 text-slate-100">
          We regularly design bespoke roadmaps for enterprise teams, DAO
          launches, and global franchise systems. Tell us what success looks
          like—we’ll build the sprint plan and budget.
        </p>
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <a
            href="mailto:blaine@designfi.studio"
            className="rounded-full bg-white px-6 py-3 font-semibold text-slate-900"
          >
            Request proposal
          </a>
          <a
            href="https://x.com/DesignFiStudio"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/40 px-6 py-3 font-semibold text-white"
          >
            X (Twitter)
          </a>
          <a
            href="https://t.me/DesignFiStudio"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/40 px-6 py-3 font-semibold text-white"
          >
            Telegram (24/7)
          </a>
        </div>
      </div>
    </div>
  );
}

