import { NextRequest, NextResponse } from "next/server";
import Parser from "rss-parser";

const parser = new Parser();

interface ExternalArticle {
  id: string;
  title: string;
  content: string;
  image: string;
  publishedAt: string;
  author: string;
  source: "external";
  externalUrl: string;
  sourceName: string;
}

// RSS feeds for crypto and business news
const RSS_FEEDS = [
  {
    url: "https://www.coindesk.com/arc/outboundfeeds/rss/",
    sourceName: "CoinDesk",
    category: "crypto",
  },
  {
    url: "https://cointelegraph.com/rss",
    sourceName: "CoinTelegraph",
    category: "crypto",
  },
  {
    url: "https://decrypt.co/feed",
    sourceName: "Decrypt",
    category: "crypto",
  },
  {
    url: "https://www.theblock.co/rss.xml",
    sourceName: "The Block",
    category: "crypto",
  },
  {
    url: "https://techcrunch.com/feed/",
    sourceName: "TechCrunch",
    category: "business",
  },
  {
    url: "https://feeds.feedburner.com/oreilly/radar",
    sourceName: "O'Reilly Radar",
    category: "business",
  },
];

// Fetch articles from a single RSS feed
async function fetchFeedArticles(feedConfig: {
  url: string;
  sourceName: string;
  category: string;
}): Promise<ExternalArticle[]> {
  try {
    const feed = await parser.parseURL(feedConfig.url);
    const articles: ExternalArticle[] = [];

    // Limit to 5 articles per feed to avoid too many articles
    const items = feed.items.slice(0, 5);

    for (const item of items) {
      if (!item.title || !item.link) continue;

      // Extract image from content or use a default
      let image = "https://via.placeholder.com/1200x630/1e293b/64748b?text=Article"; // Default placeholder
      
      if (item.contentSnippet || item.content) {
        // Try to extract image from HTML content
        const content = item.content || item.contentSnippet || "";
        const imgMatch = content.match(/<img[^>]+src="([^"]+)"/i);
        if (imgMatch && imgMatch[1]) {
          image = imgMatch[1];
        }
      }

      // Use enclosures if available (common in RSS feeds)
      if (item.enclosures && item.enclosures.length > 0) {
        const imageEnclosure = item.enclosures.find(
          (enc: { type?: string; url?: string }) => enc.type?.startsWith("image/")
        );
        if (imageEnclosure?.url) {
          image = imageEnclosure.url;
        }
      }

      // Use itunes image if available
      if ((item as any).itunes?.image) {
        image = (item as any).itunes.image;
      }

      // Generate a simple ID from the URL
      const id = Buffer.from(item.link || item.title).toString("base64").slice(0, 20);

      articles.push({
        id: `external-${id}`,
        title: item.title,
        content: item.contentSnippet || item.content || item.title || "",
        image: image,
        publishedAt: item.pubDate || new Date().toISOString(),
        author: feedConfig.sourceName,
        source: "external",
        externalUrl: item.link || "",
        sourceName: feedConfig.sourceName,
      });
    }

    return articles;
  } catch (error) {
    console.error(`Error fetching feed ${feedConfig.url}:`, error);
    return [];
  }
}

// GET - Fetch external articles from RSS feeds
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const category = searchParams.get("category"); // "crypto" or "business"

    // Filter feeds by category if specified
    const feedsToFetch = category
      ? RSS_FEEDS.filter((feed) => feed.category === category)
      : RSS_FEEDS;

    // Fetch articles from all feeds in parallel
    const feedPromises = feedsToFetch.map((feed) => fetchFeedArticles(feed));
    const feedResults = await Promise.all(feedPromises);

    // Flatten and combine all articles
    let allArticles: ExternalArticle[] = feedResults.flat();

    // Sort by published date (newest first)
    allArticles.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return dateB - dateA;
    });

    // Limit the number of articles
    allArticles = allArticles.slice(0, limit);

    return NextResponse.json(allArticles);
  } catch (error) {
    console.error("Error fetching external articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch external articles" },
      { status: 500 }
    );
  }
}

