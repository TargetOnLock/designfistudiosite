"use client";

import { useState } from "react";

const categories = [
  {
    id: "branding",
    label: "Branding",
    projects: [
      {
        title: "Northwind Labs",
        detail: "Identity + packaging for climate hardware.",
      },
      {
        title: "Atlas Hospitality",
        detail: "Luxury hotel rebrand with signage system.",
      },
    ],
  },
  {
    id: "websites",
    label: "Websites",
    projects: [
      {
        title: "Helio Capital",
        detail: "Investor-ready fund website with CMS.",
      },
      {
        title: "Bloom Dental",
        detail: "High-converting local clinic experience.",
      },
    ],
  },
  {
    id: "social",
    label: "Social Media",
    projects: [
      {
        title: "FitCore",
        detail: "Always-on content engine & paid motion suite.",
      },
      {
        title: "Urban Growers",
        detail: "TikTok + Reels storytelling with UGC tie-ins.",
      },
    ],
  },
  {
    id: "crypto",
    label: "Crypto Projects",
    projects: [
      {
        title: "NovaDEX",
        detail: "Token launch creative & trending campaigns.",
      },
      {
        title: "OrbitAI",
        detail: "Investor deck + community push for AI x Web3.",
      },
    ],
  },
  {
    id: "nft",
    label: "NFT Designs",
    projects: [
      {
        title: "Mythos Beasts",
        detail: "Lore, minting site, and 10k asset system.",
      },
      {
        title: "MetroVerse",
        detail: "Utility-focused PFP collection with AR preview.",
      },
    ],
  },
];

export default function PortfolioPage() {
  const [active, setActive] = useState("branding");
  const activeCategory = categories.find((c) => c.id === active);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
          Portfolio
        </p>
        <h1 className="text-4xl font-semibold text-white">
          Multi-industry work with a focus on conversion and community.
        </h1>
        <p className="text-lg text-slate-300">
          Browse brand systems, web experiences, campaign suites, crypto
          launches, and NFT drops. Every project pairs aesthetics with measurable
          performance.
        </p>
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActive(cat.id)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              cat.id === active
                ? "bg-white text-slate-900"
                : "border border-white/20 text-white"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {activeCategory?.projects.map((project) => (
          <div
            key={project.title}
            className="rounded-3xl border border-white/10 bg-white/5 p-6"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              {activeCategory.label}
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white">
              {project.title}
            </h3>
            <p className="mt-2 text-slate-300">{project.detail}</p>
            <div className="mt-6 h-40 rounded-2xl border border-dashed border-white/10 bg-slate-900/40" />
          </div>
        ))}
      </div>
    </div>
  );
}

