const posts = [
  {
    title: "Bridging Web2 trust with Web3 hype",
    excerpt:
      "How to translate traditional brand storytelling into token launches without losing credibility.",
    tag: "Strategy",
  },
  {
    title: "Telegram community stack for 24/7 support",
    excerpt:
      "The exact bot, mod, and automation framework we install for every crypto project.",
    tag: "Playbook",
  },
  {
    title: "Design systems that scale from pitch decks to NFT mints",
    excerpt:
      "Why we prototype typography, motion, and lore simultaneously to keep teams aligned.",
    tag: "Design",
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
          Resources / Blog
        </p>
        <h1 className="text-4xl font-semibold text-white">
          Insights for marketing leaders, founders, and DAO operators.
        </h1>
        <p className="text-lg text-slate-300">
          We publish mini playbooks covering brand foundations, campaign ops,
          growth analytics, and Web3 community tactics.
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.title}
            className="rounded-3xl border border-white/10 bg-white/5 p-6"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              {post.tag}
            </p>
            <h2 className="mt-3 text-xl font-semibold text-white">
              {post.title}
            </h2>
            <p className="mt-2 text-sm text-slate-300">{post.excerpt}</p>
            <p className="mt-4 text-sm text-slate-400">New article every week</p>
          </article>
        ))}
      </div>
    </div>
  );
}

