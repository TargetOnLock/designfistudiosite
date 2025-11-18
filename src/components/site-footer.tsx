import Link from "next/link";

const footerLinks = [
  {
    title: "Studio",
    items: [
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Crypto Marketing", href: "/crypto-marketing" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Portfolio", href: "/portfolio" },
      { label: "Blog", href: "/blog" },
      { label: "Packages", href: "/packages" },
    ],
  },
  {
    title: "Connect",
    items: [
      { label: "Telegram", href: "https://t.me/BlaineDesignFi" },
      { label: "Email", href: "mailto:hello@designfi.studio" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-white/10 bg-slate-950/80">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
            DesignFi Studio
          </p>
          <p className="text-lg text-slate-300">
            Hybrid Web2/Web3 agency delivering strategic design, marketing, and
            launch support for ambitious brands.
          </p>
        </div>
        <div className="grid flex-1 gap-6 sm:grid-cols-3">
          {footerLinks.map((group) => (
            <div key={group.title} className="space-y-3">
              <p className="text-sm font-semibold text-white">{group.title}</p>
              <ul className="space-y-2 text-sm text-slate-300">
                {group.items.map((item) =>
                  item.href.startsWith("http") ? (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="transition hover:text-white"
                      >
                        {item.label}
                      </a>
                    </li>
                  ) : (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="transition hover:text-white"
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/5 bg-black/40">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>
            © {currentYear} DesignFi Studio. Crafted for both real-world &
            crypto-native teams.
          </p>
          <p>Built with Next.js & Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}

