import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const ARTICLES_FILE = path.join(process.cwd(), "data", "articles.json");

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.dirname(ARTICLES_FILE);
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true });
  }
}

// GET - Fetch all articles
export async function GET() {
  try {
    await ensureDataDir();
    
    if (!existsSync(ARTICLES_FILE)) {
      return NextResponse.json([]);
    }

    const fileContent = await readFile(ARTICLES_FILE, "utf-8");
    const articles = JSON.parse(fileContent) as Array<{ publishedAt: string }>;
    
    // Sort by published date (newest first)
    articles.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return NextResponse.json(articles);
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
    await ensureDataDir();

    const article = await request.json();

    // Validate required fields
    if (!article.title || !article.content || !article.image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Read existing articles
    let articles = [];
    if (existsSync(ARTICLES_FILE)) {
      const fileContent = await readFile(ARTICLES_FILE, "utf-8");
      articles = JSON.parse(fileContent);
    }

    // Add new article
    const newArticle = {
      ...article,
      id: article.id || randomUUID(),
      publishedAt: article.publishedAt || new Date().toISOString(),
    };

    articles.unshift(newArticle); // Add to beginning

    // Save back to file
    await writeFile(ARTICLES_FILE, JSON.stringify(articles, null, 2), "utf-8");

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

