import type { Metadata } from "next";
import { generateArticleKeywords } from "@/lib/seo-utils";
import { getAllArticles } from "@/lib/articles-data";

export async function generateMetadata(): Promise<Metadata> {
  const articles = await getAllArticles();
  
  // Extract keywords from all articles
  const allKeywords = new Set<string>();
  articles.forEach((article: { title: string; content: string }) => {
    const keywords = generateArticleKeywords(article.title, article.content);
    keywords.forEach(keyword => allKeywords.add(keyword));
  });

  // Add base keywords
  const baseKeywords = [
    "DesignFi Studio",
    "Web3 articles",
    "crypto articles",
    "blockchain articles",
    "marketing articles",
    "design articles",
    "community articles",
  ];
  
  baseKeywords.forEach(keyword => allKeywords.add(keyword));

  const keywordsArray = Array.from(allKeywords).slice(0, 20);

  return {
    title: "Articles | Web3, Crypto & Marketing Insights | DesignFi Studio",
    description:
      "Insights, strategies, and stories from our community of creators and builders. Read articles about Web3, crypto marketing, branding, and growth strategies.",
    keywords: keywordsArray,
    openGraph: {
      title: "Articles | Web3, Crypto & Marketing Insights | DesignFi Studio",
      description:
        "Insights, strategies, and stories from our community of creators and builders.",
      url: "https://designfi.studio/articles",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Articles | DesignFi Studio",
      description: "Insights, strategies, and stories from our community.",
    },
    alternates: {
      canonical: "https://designfi.studio/articles",
    },
  };
}

export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

