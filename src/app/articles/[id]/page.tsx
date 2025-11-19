"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Send, Twitter, Calendar, User } from "lucide-react";

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

export default function ArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const response = await fetch("/api/articles");
        if (response.ok) {
          const articles = await response.json();
          const foundArticle = articles.find(
            (a: Article) => a.id === params.id
          );
          if (foundArticle) {
            setArticle(foundArticle);
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
        {/* Featured Image */}
        {article.image && (
          <div className="relative w-full h-96 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="p-8 md:p-12">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6">
            {article.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 mb-8 pb-8 border-b border-white/10">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{article.author}</span>
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

          {/* Author Links */}
          {(article.telegramLink || article.twitterLink || article.websiteLink) && (
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

