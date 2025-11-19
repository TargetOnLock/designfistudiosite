"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, ExternalLink, Send, Twitter } from "lucide-react";

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
      <div className="flex items-center justify-between mb-10">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            Published Articles
          </p>
          <h1 className="text-4xl font-semibold text-white">
            Community Articles
          </h1>
          <p className="text-lg text-slate-300">
            Insights, strategies, and stories from our community of creators and builders.
          </p>
        </div>
        <Link
          href="/articles/publish"
          className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(139,92,246,0.35)] transition hover:-translate-y-0.5 flex items-center gap-2"
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className="group rounded-3xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/20 transition block"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-2 line-clamp-2 group-hover:text-violet-300 transition">
                  {article.title}
                </h2>
                <p className="text-sm text-slate-300 mb-4 line-clamp-3">
                  {article.content}
                </p>

                {/* Author & Date */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                  <span>{article.author}</span>
                  <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>

                {/* Links */}
                {(article.telegramLink || article.twitterLink || article.websiteLink) && (
                  <div 
                    className="flex items-center gap-3 pt-4 border-t border-white/10"
                    onClick={(e) => e.stopPropagation()}
                  >
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
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
