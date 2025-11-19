import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabase } from "@/lib/supabase";

// Fallback in-memory store if Supabase is not configured
const articlesStore: Array<{
  id: string;
  title: string;
  content: string;
  image: string;
  telegramLink?: string;
  twitterLink?: string;
  websiteLink?: string;
  publishedAt: string;
  author: string;
}> = [];

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};

// GET - Fetch all articles or a single article by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // If Supabase is configured, use it
    if (isSupabaseConfigured()) {
      if (id) {
        // Fetch single article
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("id", id)
          .single();

        if (error || !data) {
          console.error("Error fetching article:", error);
          return NextResponse.json(
            { error: "Article not found" },
            { status: 404 }
          );
        }

        // Convert snake_case to camelCase for response
        return NextResponse.json({
          id: data.id,
          title: data.title,
          content: data.content,
          image: data.image,
          telegramLink: data.telegram_link,
          twitterLink: data.twitter_link,
          websiteLink: data.website_link,
          publishedAt: data.published_at,
          author: data.author,
        });
      } else {
        // Fetch all articles
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .order("published_at", { ascending: false });

        if (error) {
          console.error("Error fetching articles:", error);
          throw error;
        }

        // Convert snake_case to camelCase for response
        const articles = (data || []).map((article) => ({
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

        return NextResponse.json(articles);
      }
    } else {
      // Fallback to in-memory store
      if (id) {
        const article = articlesStore.find((a) => a.id === id);
        if (article) {
          return NextResponse.json(article);
        }
        return NextResponse.json(
          { error: "Article not found" },
          { status: 404 }
        );
      }

      const sortedArticles = [...articlesStore].sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime()
      );

      return NextResponse.json(sortedArticles);
    }
  } catch (error) {
    console.error("Error reading articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

// POST - Save a new article
export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/articles - Starting...");

    const article = await request.json();
    console.log("Article received:", {
      title: article.title,
      contentLength: article.content?.length,
      hasImage: !!article.image,
      imageSize: article.image ? article.image.length : 0,
    });

    // Validate required fields
    if (!article.title || !article.content || !article.image) {
      console.error("Missing required fields:", {
        hasTitle: !!article.title,
        hasContent: !!article.content,
        hasImage: !!article.image,
      });
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: "Title, content, and image are required",
        },
        { status: 400 }
      );
    }

    // Create new article
    const newArticle = {
      id: article.id || randomUUID(),
      title: article.title.trim(),
      content: article.content.trim(),
      image: article.image,
      telegram_link: article.telegramLink || null,
      twitter_link: article.twitterLink || null,
      website_link: article.websiteLink || null,
      published_at: article.publishedAt || new Date().toISOString(),
      author: article.author || "Anonymous",
    };

    // If Supabase is configured, use it
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("articles")
        .insert([newArticle])
        .select()
        .single();

      if (error) {
        console.error("Error saving to Supabase:", error);
        throw error;
      }

      console.log("Article saved to Supabase:", data.id);
      // Convert back to camelCase for response
      return NextResponse.json(
        {
          id: data.id,
          title: data.title,
          content: data.content,
          image: data.image,
          telegramLink: data.telegram_link,
          twitterLink: data.twitter_link,
          websiteLink: data.website_link,
          publishedAt: data.published_at,
          author: data.author,
        },
        { status: 201 }
      );
    } else {
      // Fallback to in-memory store
      const articleForStore = {
        id: newArticle.id,
        title: newArticle.title,
        content: newArticle.content,
        image: newArticle.image,
        telegramLink: newArticle.telegram_link || undefined,
        twitterLink: newArticle.twitter_link || undefined,
        websiteLink: newArticle.website_link || undefined,
        publishedAt: newArticle.published_at,
        author: newArticle.author,
      };

      articlesStore.unshift(articleForStore);
      console.log("Article saved to in-memory store:", articleForStore.id);
      console.log("Total articles in store:", articlesStore.length);

      return NextResponse.json(articleForStore, { status: 201 });
    }
  } catch (error) {
    console.error("Error saving article:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to save article", details: errorMessage },
      { status: 500 }
    );
  }
}
