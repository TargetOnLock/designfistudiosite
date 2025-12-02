import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DesignFi Studio | Hybrid Web2 & Web3 Creative Agency",
  description:
    "Hybrid Web2 & Web3 creative agency delivering elegant design systems, growth campaigns, and brand strategy for ambitious brands.",
  keywords: [
    "DesignFi Studio",
    "Web3 marketing agency",
    "crypto marketing",
    "branding studio",
    "hybrid Web2 Web3 agency",
    "design and growth studio",
    "token launch marketing",
    "creative agency",
    "brand strategy",
    "growth campaigns",
    "Web3 branding",
    "crypto agency",
    "NFT marketing",
    "blockchain marketing",
  ],
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
    creator: "@DesignFiStudio",
  },
  alternates: {
    canonical: "https://designfi.studio",
  },
};

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
        <div className="relative">
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
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 overflow-hidden">
            <Image
              src="/blockchain.png"
              alt="Blockchain network visualization showing interconnected nodes and distributed systems powering Web3 technology"
              width={600}
              height={400}
              className="w-full h-auto object-contain"
              priority
            />
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
          <p className="text-slate-300 mb-4">
            Our creative agency combines strategic thinking with execution excellence.
            We&apos;ve helped over 120 IRL launches and 60+ Web3 campaigns succeed through
            elegant design systems, comprehensive growth campaigns, and brand strategies
            tailored to ambitious brands. From token launches to franchise rollouts,
            DesignFi Studio is the creative agency partner that bridges Web2 expertise
            with Web3 innovation.
          </p>
          <p className="text-slate-300">
            What sets us apart is our deep understanding of both traditional marketing
            channels and emerging Web3 ecosystems. We don&apos;t just apply Web2 tactics
            to Web3 projects—we create native strategies that resonate with crypto
            communities while maintaining the polish and professionalism that traditional
            brands expect. Our team brings years of experience in brand development,
            digital marketing, and blockchain technology, ensuring your project gets
            the strategic depth it deserves.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-12">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Our Approach: Strategic Design Meets Growth Marketing
            </h2>
            <p className="text-slate-300 mb-4">
              At DesignFi Studio, we believe that great design and effective marketing
              go hand in hand. Our process begins with deep research into your market,
              competitors, and target audience. We analyze what&apos;s working in your
              industry, identify gaps in the market, and develop a unique positioning
              that sets your brand apart. This research-driven approach ensures that
              every design decision and marketing campaign is backed by data and strategic
              insight.
            </p>
            <p className="text-slate-300 mb-4">
              Our design systems are built for scalability and consistency. Whether
              you&apos;re launching a new product, rebranding an existing company, or
              creating a token launch campaign, we develop visual identities that work
              across all touchpoints. From your website and social media to packaging
              and investor decks, our design systems ensure your brand looks cohesive
              and professional everywhere it appears.
            </p>
            <p className="text-slate-300">
              When it comes to growth marketing, we focus on measurable results. Our
              campaigns are designed with clear KPIs and conversion goals in mind. We
              leverage both traditional channels like Google Ads and Facebook, as well
              as Web3-native platforms like Twitter, Discord, and Telegram. Our team
              understands the nuances of each platform and creates content that performs
              well in each environment, maximizing your ROI and driving real business
              results.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 overflow-hidden">
            <Image
              src="/blockchain.png"
              alt="Distributed blockchain network with interconnected nodes representing decentralized Web3 infrastructure and cryptocurrency technology"
              width={600}
              height={600}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-12">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Industries We Serve: From IRL Businesses to Web3 Projects
          </h2>
          <p className="text-slate-300 mb-4">
            DesignFi Studio works with a diverse range of clients across multiple
            industries. For traditional businesses, we&apos;ve helped franchises expand
            their digital presence, supported impact organizations in building their
            brand awareness, and enabled founders to launch their products with
            professional marketing campaigns. Our IRL services include brand strategy,
            website development, SEO optimization, paid media management, and content
            creation that drives engagement and conversions.
          </p>
          <p className="text-slate-300 mb-4">
            In the Web3 space, we&apos;ve supported token launches, NFT collections,
            DeFi protocols, and blockchain infrastructure projects. We understand the
            unique challenges of marketing in the crypto space, from navigating
            regulatory considerations to building authentic community engagement. Our
            Web3 marketing services include token branding, community management, KOL
            partnerships, influencer campaigns, and investor relations support.
          </p>
          <p className="text-slate-300">
            What makes us unique is our ability to bridge these two worlds. We&apos;ve
            helped traditional companies explore Web3 opportunities, and we&apos;ve
            helped crypto projects establish credibility with mainstream audiences.
            This hybrid approach means we can support your brand&apos;s evolution,
            whether you&apos;re starting in Web2 and moving to Web3, or vice versa.
            Our team speaks both languages and understands how to translate your
            brand story across different audiences and platforms.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-12">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Results That Matter: Measurable Impact for Your Brand
          </h2>
          <p className="text-slate-300 mb-4">
            We measure success by the impact we create for your business. Our growth
            campaigns are designed with clear metrics and KPIs, and we provide regular
            reporting so you always know how your marketing is performing. Whether
            it&apos;s increased website traffic, higher conversion rates, stronger
            community engagement, or successful token launches, we track the metrics
            that matter most to your business goals.
          </p>
          <p className="text-slate-300 mb-4">
            Our design work is evaluated not just by how it looks, but by how it
            performs. We create conversion-focused websites that turn visitors into
            customers, landing pages that drive sign-ups, and brand identities that
            build trust and recognition. Every design decision is made with your
            business objectives in mind, ensuring that our creative work drives real
            business value.
          </p>
          <p className="text-slate-300">
            Beyond the numbers, we&apos;re proud of the relationships we&apos;ve built
            with our clients. Many of our clients work with us on multiple projects,
            from initial brand development through ongoing marketing support. We see
            ourselves as long-term partners in your growth journey, not just vendors
            who deliver a project and move on. This partnership approach means we
            understand your business deeply and can provide strategic guidance that
            goes beyond just design and marketing execution.
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
