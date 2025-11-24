import Image from "next/image";
import { Send, Linkedin, Mail } from "lucide-react";
import type { Metadata } from "next";
import profilePic from "@/../public/pic.jpg";

export const metadata: Metadata = {
  title: "About Us | DesignFi Studio - Hybrid Web2/Web3 Creative Agency",
  description:
    "Learn about DesignFi Studio, a hybrid Web2/Web3 agency built for speed, craft, and measurable results. Meet Blaine Powers, Owner & CEO, and discover our mission to bridge traditional and crypto marketing.",
  keywords: [
    "DesignFi Studio",
    "about DesignFi",
    "Blaine Powers",
    "Web3 agency",
    "hybrid agency",
    "creative agency",
    "digital marketing agency",
    "Web2 Web3",
    "crypto agency",
    "branding agency",
  ],
  openGraph: {
    title: "About Us | DesignFi Studio - Hybrid Web2/Web3 Creative Agency",
    description:
      "A hybrid Web2/Web3 agency built for speed, craft, and measurable results.",
    url: "https://designfi.studio/about",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | DesignFi Studio",
    description: "A hybrid Web2/Web3 agency built for speed, craft, and measurable results.",
  },
  alternates: {
    canonical: "https://designfi.studio/about",
  },
};

const pillars = [
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
          management. 
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
      
      {/* Owner/CEO Profile */}
      <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="relative w-48 h-48 md:w-56 md:h-56 flex-shrink-0 mx-auto md:mx-0">
            <Image
              src={profilePic}
              alt="Blaine Powers"
              fill
              className="rounded-2xl object-cover border-2 border-white/20"
              sizes="(max-width: 768px) 192px, 224px"
            />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400 mb-2">
                Owner & CEO
              </p>
              <h2 className="text-3xl font-semibold text-white">
                Blaine Powers
              </h2>
            </div>
            <div className="space-y-3 text-slate-300">
              <p>
                With a degree in Digital Marketing, Blaine brings a strategic and data-driven approach to every project at DesignFi Studio. His expertise bridges the gap between traditional marketing principles and cutting-edge Web3 strategies.
              </p>
              <p>
                Family-oriented and deeply dedicated to his work, Blaine leads the studio with a commitment to excellence and a focus on building lasting relationships with clients. His vision drives DesignFi Studio's mission to deliver measurable results for both Web2 and Web3 brands.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-4">
              <a
                href="https://t.me/BlaineDesignFi"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white transition hover:border-white/40 hover:bg-white/10"
              >
                <Send className="h-4 w-4" />
                Telegram (DM)
              </a>
              <a
                href="https://www.linkedin.com/in/blaine-powers/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white transition hover:border-white/40 hover:bg-white/10"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
              <a
                href="mailto:blaine@designfi.studio"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white transition hover:border-white/40 hover:bg-white/10"
              >
                <Mail className="h-4 w-4" />
                Email
              </a>
            </div>
          </div>
        </div>
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

