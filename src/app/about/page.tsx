const pillars = [
  {
    title: "Hybrid mindset",
    detail:
      "We launched IRL campaigns for Fortune 500 teams and helped tokens trend on DexTools. That duality keeps our work grounded and future-forward.",
  },
  {
    title: "Strategy first",
    detail:
      "Every engagement starts with research sprints, whiteboard sessions, and success metrics aligned to both community health and revenue.",
  },
  {
    title: "Creative x technical",
    detail:
      "Designers, developers, motion artists, and growth leads sit in a single squad so decisions happen faster and assets stay cohesive.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
          About DesignFi Studio
        </p>
        <h1 className="text-4xl font-semibold text-white">
          A hybrid Web2/Web3 agency built for speed, craft, and measurable
          results.
        </h1>
        <p className="text-lg text-slate-300">
          We believe brand love and token momentum come from the same place:
          clear positioning, beautiful execution, and relentless community
          management. The studio is remote-first with pods across North America
          and the EU.
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {pillars.map((pillar) => (
          <div
            key={pillar.title}
            className="rounded-3xl border border-white/10 bg-white/5 p-6"
          >
            <h3 className="text-xl font-semibold text-white">{pillar.title}</h3>
            <p className="mt-3 text-sm text-slate-300">{pillar.detail}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900/80 to-slate-900/40 p-8">
        <h2 className="text-2xl font-semibold text-white">
          Mission & Values
        </h2>
        <p className="mt-4 text-slate-300">
          DesignFi Studio exists to help visionary founders build trust across
          both traditional buyers and on-chain communities. We stand for
          transparency, creative experimentation, and ethical growth.
        </p>
      </div>
    </div>
  );
}

