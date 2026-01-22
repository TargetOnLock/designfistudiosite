import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Award } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certifications | Blaine Powers - DesignFi Studio",
  description:
    "Professional certifications earned by Blaine Powers, Owner & CEO of DesignFi Studio, including certificates from WTC and other institutions.",
  openGraph: {
    title: "Certifications | Blaine Powers - DesignFi Studio",
    description: "Professional certifications earned by Blaine Powers.",
    url: "https://designfi.studio/about/certifications",
    type: "website",
  },
  alternates: {
    canonical: "https://designfi.studio/about/certifications",
  },
};

// Certification data structure
interface Certification {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  imageUrl?: string;
  imageAlt?: string;
  description?: string;
  credentialId?: string;
  credentialUrl?: string;
}

const certifications: Certification[] = [
  {
    id: "1",
    name: "Content Marketing Certified",
    issuer: "HubSpot Academy",
    date: "Jan 24 2025 - Feb 23 2027",
    imageUrl: "/contentmarketingcert.png",
    imageAlt: "Content Marketing Certified by HubSpot Academy",
    description:
      "Fully capable and skilled in content marketing. Tested on best practices and capable of applying them to long-term content planning, content creation, promotion, and analysis, and increasing results through growth marketing.",
    credentialId: "57dd2914163c4c49b3ab1576094b2ac5",
    credentialUrl: "https://app.hubspot.com/learning-center/certificate/57dd2914163c4c49b3ab1576094b2ac5",
  },
  {
    id: "2",
    name: "Social Media Certified",
    issuer: "HubSpot Academy",
    date: "Sep 21 2025 - Oct 21 2027",
    imageUrl: "/socialmediahubspot.png",
    imageAlt: "Social Media Certified by HubSpot Academy",
    description:
      "Fully capable and skilled in applying inbound social media strategy. Tested on best practices including: social monitoring, content strategy, social engagement, creating social media policies, and demonstrating social ROI to stakeholders.",
    credentialId: "203ec4fa9eb840a1aa7358fc9cc2a089",
    credentialUrl: "https://app.hubspot.com/learning-center/certificate/203ec4fa9eb840a1aa7358fc9cc2a089",
  },
  {
    id: "3",
    name: "Email Marketing Certified",
    issuer: "HubSpot Academy",
    date: "Sep 30 2025 - Oct 30 2027",
    imageUrl: "/emailmarkhubspot.png",
    imageAlt: "Email Marketing Certified by HubSpot Academy",
    description:
      "Knowledgeable of building an email marketing strategy to build trust. Tested on best practices that focus on segmentation, high-performing email sends, outlining email design, and email deliverability, and can establish metrics to test, optimize, and improve their email marketing strategy.",
    credentialId: "9a06c7534c144d85a7817689eb2816b5",
    credentialUrl: "https://app.hubspot.com/learning-center/certificate/9a06c7534c144d85a7817689eb2816b5",
  },
  {
    id: "4",
    name: "SEO Certified",
    issuer: "HubSpot Academy",
    date: "Dec 8 2025 - Jan 7 2027",
    imageUrl: "/seohubspot.png",
    imageAlt: "SEO Certified by HubSpot Academy",
    description:
      "Knowledgeable about SEO and capable of optimizing a website to perform well in search engines.",
    credentialId: "c3cd339fa56445e6a71d152c31f3d403",
    credentialUrl: "https://app.hubspot.com/learning-center/certificate/c3cd339fa56445e6a71d152c31f3d403",
  },
  {
    id: "5",
    name: "Google Analytics Certification",
    issuer: "Skillshop",
    date: "Nov 5 2025 - Nov 5 2026",
    imageUrl: "https://pdf.ms.credential.net/v2/certificate/image?env=production&credential=s8kww20k&variant=medium",
    imageAlt: "Google Analytics Certification from Skillshop",
    description:
      "Showcase your ability to use Google Analytics 4 to gain valuable insights and make marketing decisions. Certified users will demonstrate an understanding of Google Analytics, including how to set up and structure a property, and use various reporting tools and features. By earning the Google Analytics Certification, Google recognizes your ability to: Setup a Google Analytics 4 property for a website or an app, collect the data you need for your business and use the various reporting tools and features, and recognize key measurement features that can show the effectiveness of your online marketing efforts.",
    credentialId: "e089dbeb-3480-4da3-b5cb-882ec4a33272",
    credentialUrl: "https://www.credential.net/e089dbeb-3480-4da3-b5cb-882ec4a33272",
  },
  {
    id: "6",
    name: "Google Ads Search Certification",
    issuer: "Skillshop",
    date: "Mar 17 2025 - Mar 17 2026",
    imageUrl: "https://pdf.ms.credential.net/v2/certificate/image?env=production&credential=5gkkzk4s&variant=medium",
    imageAlt: "Google Ads Search Certification from Skillshop",
    description:
      "Demonstrate your mastery of building and optimizing Google Search campaigns. Certified users will exhibit the ability to leverage automated solutions like Smart Bidding to boost campaign performance for specific marketing objectives. By earning the Google Ads Search Certification, Google recognizes your ability to: Translate a vision for online marketing into a coherent digital marketing strategy, develop a Google Search strategy with wider company marketing plans, generate a plan to increase leads, sales or web traffic using Google Search, and ensure your Search marketing plan is aligned with your digital marketing budget.",
    credentialId: "bfffdf98-4d7d-4312-a1c8-38e0e6346533",
    credentialUrl: "https://www.credential.net/bfffdf98-4d7d-4312-a1c8-38e0e6346533",
  },
];

export default function CertificationsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      {/* Back Button */}
      <Link
        href="/about"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to About
      </Link>

      {/* Header */}
      <div className="max-w-3xl space-y-4 mb-10">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 p-3">
            <Award className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-4xl font-semibold text-white">Certifications</h1>
        </div>
        <p className="text-lg text-slate-300">
          Professional certifications and credentials earned throughout my academic and professional journey.
        </p>
      </div>

      {/* Certifications Grid */}
      {certifications.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition flex flex-col"
            >
              {/* Certificate Image */}
              {cert.imageUrl && (
                <div className="relative w-full aspect-[4/3] mb-4 rounded-lg overflow-hidden bg-slate-800">
                  <Image
                    src={cert.imageUrl}
                    alt={cert.imageAlt || cert.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}

              {/* Certificate Info */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {cert.name}
                </h3>
                <div className="space-y-1 text-sm text-slate-400 mb-3">
                  <p className="font-medium">{cert.issuer}</p>
                  {cert.date && <p>{cert.date}</p>}
                  {cert.credentialId && (
                    <p className="text-xs text-slate-500">
                      ID: {cert.credentialId}
                    </p>
                  )}
                </div>
                {cert.description && (
                  <p className="text-sm text-slate-300 mb-3">
                    {cert.description}
                  </p>
                )}
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-violet-400 hover:text-violet-300 transition inline-flex items-center gap-1"
                  >
                    Verify Credential
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
          <Award className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-300 text-lg">
            Certification information will be added soon.
          </p>
          <p className="text-slate-400 text-sm mt-2">
            Check back later for a complete list of certifications and credentials.
          </p>
        </div>
      )}
    </div>
  );
}

