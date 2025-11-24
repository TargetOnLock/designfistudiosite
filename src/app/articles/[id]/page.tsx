"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Send, Twitter, Calendar, User, Globe } from "lucide-react";

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

export default function ArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const response = await fetch(`/api/articles?id=${params.id}`);
        if (response.ok) {
          const foundArticle = await response.json();
          if (foundArticle && !foundArticle.error) {
            setArticle(foundArticle);
            
            // If it's an external article, redirect to the external URL
            if (foundArticle.source === "external" && foundArticle.externalUrl) {
              // Small delay to show the page briefly, then redirect
              setTimeout(() => {
                window.location.href = foundArticle.externalUrl;
              }, 2000);
            }
          } else {
            setNotFound(true);
          }
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error loading article:", error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      loadArticle();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-12">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
          <p className="text-xl font-semibold text-white">Loading article...</p>
        </div>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-12">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
          <p className="text-xl font-semibold text-white mb-4">
            Article not found
          </p>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      {/* Back Button */}
      <Link
        href="/articles"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Articles
      </Link>

      <article className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
        {/* External Article Notice */}
        {article.source === "external" && article.externalUrl && (
          <div className="bg-blue-500/20 border-b border-blue-500/30 p-6">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-blue-400" />
              <div className="flex-1">
                <p className="text-sm text-blue-300 font-medium">
                  This is an external article from {article.sourceName || "an external source"}
                </p>
                <p className="text-xs text-blue-400/80 mt-1">
                  Redirecting to the original article...
                </p>
              </div>
              <a
                href={article.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition flex items-center gap-2"
              >
                Read Now
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}

        {/* Featured Image */}
        {article.image && (
          <div className="relative w-full min-h-96 max-h-[600px] overflow-hidden bg-slate-900/50 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.image}
              alt={article.title}
              className="max-w-full max-h-full w-auto h-auto object-contain"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="p-8 md:p-12">
          {/* Title */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <h1 className="text-4xl md:text-5xl font-semibold text-white flex-1">
              {article.title}
            </h1>
            {article.source === "external" && (
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 whitespace-nowrap">
                External
              </span>
            )}
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 mb-8 pb-8 border-b border-white/10">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{article.sourceName || article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(article.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</span>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-invert max-w-none">
            <div className="text-lg text-slate-300 leading-relaxed whitespace-pre-wrap">
              {article.content}
            </div>
          </div>

          {/* External Article CTA */}
          {article.source === "external" && article.externalUrl && (
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Read the Full Article
                </h3>
                <p className="text-sm text-slate-300 mb-4">
                  This is a preview. Read the complete article on {article.sourceName || "the original source"}.
                </p>
                <a
                  href={article.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-600 transition"
                >
                  <Globe className="h-4 w-4" />
                  Read on {article.sourceName || "Original Source"}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          )}

          {/* Author Links - Only for self-published articles */}
          {article.source !== "external" && (article.telegramLink || article.twitterLink || article.websiteLink) && (
            <div className="mt-12 pt-8 border-t border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">
                Connect with the Author
              </h3>
              <div className="flex flex-wrap gap-4">
                {article.telegramLink && (
                  <a
                    href={article.telegramLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm text-slate-300 hover:text-white hover:border-white/40 transition"
                  >
                    <Send className="h-4 w-4" />
                    Telegram
                  </a>
                )}
                {article.twitterLink && (
                  <a
                    href={article.twitterLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm text-slate-300 hover:text-white hover:border-white/40 transition"
                  >
                    <Twitter className="h-4 w-4" />
                    X (Twitter)
                  </a>
                )}
                {article.websiteLink && (
                  <a
                    href={article.websiteLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm text-slate-300 hover:text-white hover:border-white/40 transition"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Website
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Back to Articles Button */}
      <div className="mt-8 text-center">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          View All Articles
        </Link>
      </div>
    </div>
  );
}

