const services = [
  {
    title: "Brand Strategy & Identity",
    items: [
      "Audience and competitor research",
      "Messaging + positioning guidelines",
      "Logo suites & visual systems",
      "Pitch decks, brochures, packaging",
    ],
  },
  {
    title: "Campaigns & Content",
    items: [
      "Paid social + search campaign orchestration",
      "High-polish ad creative & motion",
      "Photo/video direction",
      "Lifecycle email + automation flows",
    ],
  },
  {
    title: "Web & Product",
    items: [
      "Conversion-focused websites & funnels",
      "Landing pages, microsites, portals",
      "E-commerce setup & CRO",
      "Analytics + experimentation",
    ],
  },
  {
    title: "Growth & Visibility",
    items: [
      "SEO + local SEO programs",
      "Reputation management",
      "Paid media operations",
      "Analytics, dashboards, and reporting",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="max-w-3xl space-y-5">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
          Services for real-world brands
        </p>
        <h1 className="text-4xl font-semibold text-white">
          Strategy, creative, and marketing built for IRL growth.
        </h1>
        <p className="text-lg text-slate-300">
          We treat every engagement like a launch. DesignFi Studio pairs senior
          strategists, art directors, and performance marketers so your brand
          ships cohesive systems—not random acts of marketing.
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {services.map((service) => (
          <div
            key={service.title}
            className="rounded-3xl border border-white/10 bg-white/5 p-6"
          >
            <h2 className="text-xl font-semibold text-white">
              {service.title}
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {service.items.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-violet-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-12 rounded-3xl border border-white/10 bg-gradient-to-r from-blue-700/40 to-violet-700/40 p-8 text-white">
        <h3 className="text-2xl font-semibold">Need something custom?</h3>
        <p className="mt-3 text-slate-100">
          We partner with in-house teams as a flexible creative department—
          covering monthly retainers, campaign sprints, or on-site production.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <a
            href="mailto:hello@designfi.studio"
            className="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white"
          >
            Email the studio
          </a>
          <a
            href="https://x.com/DesignFiStudio"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white"
          >
            X (Twitter)
          </a>
          <a
            href="https://t.me/BlaineDesignFi"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white"
          >
            DM on Telegram
          </a>
        </div>
      </div>
    </div>
  );
}

