import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabase } from "@/lib/supabase";
import { sendArticleToTelegram } from "@/lib/telegram-bot";

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
    const includeExternal = searchParams.get("includeExternal") !== "false"; // Default to true

    let selfPublishedArticles: any[] = [];

    // If Supabase is configured, use it
    if (isSupabaseConfigured()) {
      if (id) {
        // Fetch single article - check if it's external first
        if (id.startsWith("external-")) {
          // Fetch from external API
          try {
            const externalResponse = await fetch(
              `${request.nextUrl.origin}/api/articles/external?limit=100`
            );
            if (externalResponse.ok) {
              const externalArticles = await externalResponse.json();
              const article = externalArticles.find((a: any) => a.id === id);
              if (article) {
                return NextResponse.json(article);
              }
            }
          } catch (error) {
            console.error("Error fetching external article:", error);
          }
          return NextResponse.json(
            { error: "Article not found" },
            { status: 404 }
          );
        }

        // Fetch single self-published article
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
          source: "self-published",
        });
      } else {
        // Fetch all self-published articles
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .order("published_at", { ascending: false });

        if (error) {
          console.error("Error fetching articles:", error);
          throw error;
        }

        // Convert snake_case to camelCase for response
        selfPublishedArticles = (data || []).map((article) => ({
          id: article.id,
          title: article.title,
          content: article.content,
          image: article.image,
          telegramLink: article.telegram_link,
          twitterLink: article.twitter_link,
          websiteLink: article.website_link,
          publishedAt: article.published_at,
          author: article.author,
          source: "self-published",
        }));
      }
    } else {
      // Fallback to in-memory store
      if (id) {
        if (id.startsWith("external-")) {
          // Fetch from external API
          try {
            const externalResponse = await fetch(
              `${request.nextUrl.origin}/api/articles/external?limit=100`
            );
            if (externalResponse.ok) {
              const externalArticles = await externalResponse.json();
              const article = externalArticles.find((a: any) => a.id === id);
              if (article) {
                return NextResponse.json(article);
              }
            }
          } catch (error) {
            console.error("Error fetching external article:", error);
          }
          return NextResponse.json(
            { error: "Article not found" },
            { status: 404 }
          );
        }

        const article = articlesStore.find((a) => a.id === id);
        if (article) {
          return NextResponse.json({
            ...article,
            source: "self-published",
          });
        }
        return NextResponse.json(
          { error: "Article not found" },
          { status: 404 }
        );
      }

      selfPublishedArticles = [...articlesStore]
        .sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
        )
        .map((article) => ({
          ...article,
          source: "self-published",
        }));
    }

    // If fetching all articles and includeExternal is true, merge with external articles
    if (!id && includeExternal) {
      try {
        const externalResponse = await fetch(
          `${request.nextUrl.origin}/api/articles/external?limit=20`
        );
        if (externalResponse.ok) {
          const externalArticles = await externalResponse.json();
          // Combine and sort by published date
          const allArticles = [...selfPublishedArticles, ...externalArticles].sort(
            (a, b) =>
              new Date(b.publishedAt).getTime() -
              new Date(a.publishedAt).getTime()
          );
          return NextResponse.json(allArticles);
        }
      } catch (error) {
        console.error("Error fetching external articles:", error);
        // Return only self-published articles if external fetch fails
      }
    }

    return NextResponse.json(selfPublishedArticles);
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
      const savedArticle = {
        id: data.id,
        title: data.title,
        content: data.content,
        image: data.image,
        telegramLink: data.telegram_link,
        twitterLink: data.twitter_link,
        websiteLink: data.website_link,
        publishedAt: data.published_at,
        author: data.author,
        source: "self-published" as const,
      };

      // Send to Telegram channel (non-blocking)
      const articleUrl = `${request.nextUrl.origin}/articles/${savedArticle.id}`;
      sendArticleToTelegram(savedArticle, articleUrl).catch((error) => {
        console.error("Failed to send article to Telegram:", error);
        // Don't fail the request if Telegram fails
      });

      return NextResponse.json(savedArticle, { status: 201 });
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

      // Send to Telegram channel (non-blocking)
      const articleUrl = `${request.nextUrl.origin}/articles/${articleForStore.id}`;
      const articleWithSource = {
        ...articleForStore,
        source: "self-published" as const,
      };
      sendArticleToTelegram(articleWithSource, articleUrl).catch((error) => {
        console.error("Failed to send article to Telegram:", error);
        // Don't fail the request if Telegram fails
      });

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
