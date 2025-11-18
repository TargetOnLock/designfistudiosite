"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Send, Twitter, X } from "lucide-react";
import logo from "@/../public/defistudio.png";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Crypto Marketing", href: "/crypto-marketing" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About Us", href: "/about" },
  { label: "Packages", href: "/packages" },
  { label: "Articles", href: "/articles" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const renderNav = () => (
    <nav className="flex flex-col gap-2 text-sm md:flex-row md:items-center md:gap-4 lg:gap-6">
      {navItems.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full px-3 py-1.5 text-slate-300 transition hover:text-white ${
              isActive
                ? "bg-white/10 text-white shadow-[0_0_20px_rgba(79,70,229,0.35)]"
                : ""
            }`}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <header className="relative z-20 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="relative h-14 w-44">
          <Image
            src={logo}
            alt="DesignFi Studio"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 160px, 176px"
            priority
          />
        </Link>
        <div className="flex flex-1 items-center justify-end gap-3">
          <button
            className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            {open ? (
              <>
                <X className="h-4 w-4" />
                Close
              </>
            ) : (
              <>
                <Menu className="h-4 w-4" />
                Menu
              </>
            )}
          </button>
          <a
            href="https://x.com/DesignFiStudio"
            target="_blank"
            rel="noreferrer"
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 sm:flex"
            aria-label="DesignFi Studio on X (Twitter)"
          >
            <Twitter className="h-5 w-5" />
          </a>
          <a
            href="https://t.me/DesignFiStudio"
            target="_blank"
            rel="noreferrer"
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 sm:flex"
            aria-label="DesignFi Studio on Telegram"
          >
            <Send className="h-5 w-5" />
          </a>
          <Link
            href="/contact"
            className="hidden rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(139,92,246,0.35)] transition hover:-translate-y-0.5 lg:inline-flex"
          >
            Start Your Project
          </Link>
        </div>
      </div>
      {open && (
        <div className="border-t border-white/10 bg-slate-950/95 px-4 py-4 shadow-[0_20px_60px_rgba(2,6,23,0.6)]">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
            {renderNav()}
            <div className="flex flex-wrap gap-3">
              <a
                href="https://x.com/DesignFiStudio"
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 min-w-[140px] items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white"
              >
                <Twitter className="h-4 w-4" />
                X (Twitter)
              </a>
              <a
                href="https://t.me/BlaineDesignFi"
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 min-w-[140px] items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white"
              >
                <Send className="h-4 w-4" />
                Telegram
              </a>
              <Link
                href="/contact"
                className="flex flex-1 min-w-[140px] items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                Start Your Project
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

