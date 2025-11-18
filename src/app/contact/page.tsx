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
    detail: "hello@designfi.studio",
    href: "mailto:hello@designfi.studio",
  },
  {
    label: "Contact Form",
    detail: "Share your goals, timeline, and links.",
    href: "#contact-form",
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
          under 12 hours (faster via Telegram).
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {contactMethods.map((method) => (
          <a
            key={method.label}
            href={method.href}
            className="rounded-3xl border border-white/10 bg-white/5 p-6"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              {method.label}
            </p>
            <p className="mt-3 text-xl font-semibold text-white">
              {method.detail}
            </p>
            <p className="mt-3 text-sm text-slate-300">
              Tap to {method.label === "Contact Form" ? "open form" : "connect"}
            </p>
          </a>
        ))}
      </div>
      <div
        id="contact-form"
        className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">
          Contact Form
        </p>
        <form className="mt-6 grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Full name"
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-white/50 focus:outline-none md:col-span-1"
          />
          <input
            type="email"
            placeholder="Email"
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-white/50 focus:outline-none md:col-span-1"
          />
          <input
            type="text"
            placeholder="Company / Project"
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-white/50 focus:outline-none md:col-span-2"
          />
          <textarea
            placeholder="What are you building? Include launch timeline + links."
            rows={4}
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-white/50 focus:outline-none md:col-span-2"
          />
          <button
            type="submit"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 md:col-span-2"
          >
            Send message
          </button>
        </form>
        <p className="mt-4 text-xs text-slate-500">
          *Form is decorative. Connect via Telegram or email for an immediate
          reply.
        </p>
      </div>
    </div>
  );
}

