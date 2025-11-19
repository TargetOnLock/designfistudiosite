const contactMethods = [
  {
    label: "Telegram (Fastest)",
    detail: "@BlaineDesignFi",
    href: "https://t.me/BlaineDesignFi",
  },
  {
    label: "X (Twitter)",
    detail: "@DesignFiStudio",
    href: "https://x.com/DesignFiStudio",
  },
  {
    label: "Email",
    detail: "blaine@designfi.studio",
    href: "mailto:blaine@designfi.studio",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
          Contact
        </p>
        <h1 className="text-4xl font-semibold text-white">
          Start Your Project
        </h1>
        <p className="text-lg text-slate-300">
          Tell us about your brand, launch date, and target metrics. We reply in
          under 12 hours (fastest via Telegram).
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {contactMethods.map((method) => (
          <a
            key={method.label}
            href={method.href}
            target={method.href.startsWith("http") ? "_blank" : undefined}
            rel={method.href.startsWith("http") ? "noreferrer" : undefined}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/10"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              {method.label}
            </p>
            <p className="mt-3 text-xl font-semibold text-white">
              {method.detail}
            </p>
            <p className="mt-3 text-sm text-slate-300">
              Tap to connect
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}

