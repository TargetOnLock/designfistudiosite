import Link from "next/link";

const pillars = [
  {
    title: "Brand Strategy & Identity",
    description:
      "Research-backed positioning, naming, and visual systems that translate across launch decks, packaging, and product reveals.",
  },
  {
    title: "Full-Funnel Marketing",
    description:
      "Lifecycle campaigns, performance media, and automation flows crafted for measurable growth on Web2 and Web3 channels.",
  },
  {
    title: "Launch-Ready Digital",
    description:
      "Conversion-focused websites, landing pages, and hubs optimized for service funnels and token launches alike.",
  },
];

const dualTracks = [
  {
    badge: "For IRL brands",
    title: "Services",
    body: "Strategic branding, campaigns, paid media, SEO, and reputational content for founders, franchises, and impact orgs.",
    href: "/services",
    accent: "from-sky-400 to-cyan-500",
  },
  {
    badge: "For Web3 projects",
    title: "Crypto Marketing",
    body: "From token branding to trending campaigns, community ops, KOL pushes, and investor-ready storytelling.",
    href: "/crypto-marketing",
    accent: "from-violet-500 to-fuchsia-500",
  },
];

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden">
      <section className="mx-auto grid w-full max-w-6xl gap-12 px-4 pb-16 pt-12 md:grid-cols-[1.1fr_0.9fr] md:items-center md:pt-16">
        <div className="space-y-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
            Hybrid Web2 ↔ Web3 Agency
          </p>
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
              Elegant design systems and growth campaigns for ambitious brands.
            </h1>
            <p className="text-lg text-slate-300 md:text-xl">
              DesignFi Studio is a hybrid Web2 & Web3 creative agency that blends
              agency polish with web-native instincts. We build elegant design systems,
              ship high-performing websites, and craft growth campaigns for ambitious
              brands across both traditional companies and crypto-native teams. Our
              creative agency approach delivers measurable results whether you&apos;re
              launching an IRL business or a Web3 project.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/services"
              className="rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 transition hover:-translate-y-0.5"
            >
              Explore Services
            </Link>
            <Link
              href="/crypto-marketing"
              className="rounded-full border border-white/30 px-6 py-3 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/60"
            >
              See Crypto Marketing
            </Link>
          </div>
          
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-100 shadow-[0_25px_80px_rgba(2,6,23,0.8)] backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-300">
            Studio Pulse
          </p>
          <div className="mt-6 space-y-5">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <h3 className="text-base font-semibold text-white">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-slate-300">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 pb-16 md:grid-cols-2">
        {dualTracks.map((track) => (
          <div
            key={track.title}
            className="group rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.65)] transition hover:-translate-y-1"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-slate-300">
              {track.badge}
            </span>
            <h3 className="mt-4 text-2xl font-semibold text-white">
              {track.title}
            </h3>
            <p className="mt-3 text-slate-300">{track.body}</p>
            <Link
              href={track.href}
              className={`mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${track.accent} px-5 py-2 text-sm font-semibold text-white`}
            >
              Learn more →
            </Link>
          </div>
        ))}
      </section>
      <section className="mx-auto w-full max-w-6xl px-4 pb-12">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Why Choose DesignFi Studio as Your Creative Agency
          </h2>
          <p className="text-slate-300 mb-4">
            As a hybrid Web2 & Web3 creative agency, DesignFi Studio understands
            the unique challenges facing ambitious brands in both traditional and
            crypto markets. Our elegant design systems are built to scale, while
            our growth campaigns are data-driven and results-focused. Whether you&apos;re
            a Web2 company looking to expand into Web3 or a crypto-native project
            needing professional branding, we deliver creative solutions that work.
          </p>
          <p className="text-slate-300">
            Our creative agency combines strategic thinking with execution excellence.
            We&apos;ve helped over 120 IRL launches and 60+ Web3 campaigns succeed through
            elegant design systems, comprehensive growth campaigns, and brand strategies
            tailored to ambitious brands. From token launches to franchise rollouts,
            DesignFi Studio is the creative agency partner that bridges Web2 expertise
            with Web3 innovation.
          </p>
        </div>
      </section>
      <section className="mx-auto w-full max-w-6xl px-4 pb-20">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900/80 to-slate-900/40 p-8 text-center shadow-[0_25px_70px_rgba(2,6,23,0.7)]">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-300">
            Build with us
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-white">
            Launch with an agile team that ships design, dev, and growth from
            day one.
          </h2>
          <p className="mt-3 text-base text-slate-300">
            Start with a discovery sprint and leave with messaging, visual
            directions, and a go-to-market plan that bridges your real-world and
            Web3 audiences. Our creative agency delivers elegant design systems
            and growth campaigns designed for ambitious brands ready to scale.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-white px-6 py-3 font-semibold text-slate-900"
            >
              Start Your Project
            </Link>
            <Link
              href="/portfolio"
              className="rounded-full border border-white/30 px-6 py-3 font-semibold text-white"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
