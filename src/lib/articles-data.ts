/**
 * Shared article data fetching functions for server components
 * This allows us to fetch articles directly without going through the API route
 */

import { supabase } from "./supabase";

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

// In-memory store (same as in API route)
const articlesStore: Article[] = [];

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};

/**
 * Get all articles (for server components)
 */
export async function getAllArticles(): Promise<Article[]> {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("published_at", { ascending: false });

      if (error) {
        console.error("Error fetching articles:", error);
        return [];
      }

      // Convert snake_case to camelCase
      return (data || []).map((article) => ({
        id: article.id,
        title: article.title,
        content: article.content,
        image: article.image,
        telegramLink: article.telegram_link,
        twitterLink: article.twitter_link,
        websiteLink: article.website_link,
        publishedAt: article.published_at,
        author: article.author,
      }));
    } else {
      // Fallback to in-memory store
      return [...articlesStore].sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime()
      );
    }
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

/**
 * Get a single article by ID (for server components)
 */
export async function getArticleById(id: string): Promise<Article | null> {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Error fetching article:", error);
        return null;
      }

      // Convert snake_case to camelCase
      return {
        id: data.id,
        title: data.title,
        content: data.content,
        image: data.image,
        telegramLink: data.telegram_link,
        twitterLink: data.twitter_link,
        websiteLink: data.website_link,
        publishedAt: data.published_at,
        author: data.author,
      };
    } else {
      // Fallback to in-memory store
      return articlesStore.find((a) => a.id === id) || null;
    }
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

