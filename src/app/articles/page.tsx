"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, ExternalLink, Send, Twitter, Globe } from "lucide-react";

interface Article {
  id: string;
  title: string;
  content: string;
  image: string;
  telegramLink?: string;
  twitterLink?: string;
  websiteLink?: string;
  publishedAt: string;
  author: string;
  source?: "self-published" | "external";
  externalUrl?: string;
  sourceName?: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadArticles = async () => {
    try {
      const response = await fetch("/api/articles");
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      } else {
        console.error("Failed to load articles");
        // Fallback to localStorage if API fails
        if (typeof window !== "undefined") {
          const storedArticles = localStorage.getItem("publishedArticles");
          if (storedArticles) {
            try {
              setArticles(JSON.parse(storedArticles));
            } catch (error) {
              console.error("Error loading from localStorage:", error);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error loading articles:", error);
      // Fallback to localStorage
      if (typeof window !== "undefined") {
        const storedArticles = localStorage.getItem("publishedArticles");
        if (storedArticles) {
          try {
            setArticles(JSON.parse(storedArticles));
          } catch (e) {
            console.error("Error loading from localStorage:", e);
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
    
    // Listen for custom event when article is published
    const handleArticlePublished = () => {
      loadArticles();
    };
    
    window.addEventListener("articlePublished", handleArticlePublished);

    return () => {
      window.removeEventListener("articlePublished", handleArticlePublished);
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            Published Articles
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-white">
            Community Articles
          </h1>
          <p className="text-base md:text-lg text-slate-300">
            Insights, strategies, and stories from our community of creators and builders, plus curated articles from top crypto and business news outlets.
          </p>
        </div>
        <Link
          href="/articles/publish"
          className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(139,92,246,0.35)] transition hover:-translate-y-0.5 flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <Plus className="h-4 w-4" />
          Publish Article
        </Link>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
          <p className="text-xl font-semibold text-white mb-2">
            Loading articles...
          </p>
        </div>
      ) : articles.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
          <p className="text-xl font-semibold text-white mb-2">
            No articles published yet
          </p>
          <p className="text-slate-300 mb-6">
            Be the first to share your insights with the community!
          </p>
          <Link
            href="/articles/publish"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Publish Your First Article
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => {
            // External articles should link directly to the external URL
            const articleHref = article.source === "external" && article.externalUrl
              ? article.externalUrl
              : `/articles/${article.id}`;
            const isExternal = article.source === "external" && article.externalUrl;
            
            const CardContent = (
              <div className={`group rounded-3xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/20 transition ${isExternal ? 'cursor-pointer' : ''} w-full`}>
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-slate-900/50 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.image}
                  alt={article.title}
                  className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/1200x630/1e293b/64748b?text=Article";
                  }}
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                  <h2 className="text-lg md:text-xl font-semibold text-white line-clamp-2 group-hover:text-violet-300 transition flex-1">
                    {article.title}
                  </h2>
                  {article.source === "external" && (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 whitespace-nowrap self-start">
                      External
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-300 mb-4 line-clamp-3">
                  {article.content}
                </p>

                {/* Author & Date */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                  <span>{article.sourceName || article.author}</span>
                  <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>

                {/* Links */}
                <div 
                  className="flex items-center gap-3 pt-4 border-t border-white/10"
                  onClick={(e) => e.stopPropagation()}
                >
                  {article.source === "external" && article.externalUrl ? (
                    <a
                      href={article.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Globe className="h-3 w-3" />
                      Read on {article.sourceName}
                    </a>
                  ) : (
                    <>
                      {article.telegramLink && (
                        <a
                          href={article.telegramLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Send className="h-3 w-3" />
                          Telegram
                        </a>
                      )}
                      {article.twitterLink && (
                        <a
                          href={article.twitterLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Twitter className="h-3 w-3" />
                          Twitter
                        </a>
                      )}
                      {article.websiteLink && (
                        <a
                          href={article.websiteLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-3 w-3" />
                          Website
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            );

            // For external articles, use a div with onClick, otherwise use Link
            if (isExternal) {
              return (
                <div
                  key={article.id}
                  onClick={() => window.open(article.externalUrl, '_blank', 'noopener,noreferrer')}
                >
                  {CardContent}
                </div>
              );
            }

            return (
              <Link key={article.id} href={articleHref}>
                {CardContent}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
