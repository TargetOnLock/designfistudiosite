import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

// In-memory store for serverless environments (resets on deployment)
// For production, use a database like Supabase, MongoDB, or Vercel KV
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

// GET - Fetch all articles
export async function GET() {
  try {
    // Sort by published date (newest first)
    const sortedArticles = [...articlesStore].sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return NextResponse.json(sortedArticles);
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
      ...article,
      id: article.id || randomUUID(),
      publishedAt: article.publishedAt || new Date().toISOString(),
    };

    // Add to store
    articlesStore.unshift(newArticle);
    console.log("Article saved successfully:", newArticle.id);
    console.log("Total articles in store:", articlesStore.length);

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error("Error saving article:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to save article", details: errorMessage },
      { status: 500 }
    );
  }
}
