/**
 * X/Twitter Bot Cron Job
 * Posts 4 tweets per day:
 * 1. Crypto market update
 * 2. Website promotion (designfi.studio)
 * 3-4. Marketing posts (facts, tips, jokes, or insights)
 */

import { NextRequest, NextResponse } from "next/server";
import { postMultipleTweets } from "@/lib/x-bot";
import { generateDailyMarketingPosts } from "@/lib/ai-content-generator";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  console.log("X Bot cron job started at", new Date().toISOString());

  // Verify this is a cron request (optional security check)
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // Check if X bot is configured
    const { isXBotConfigured } = await import("@/lib/x-bot");
    if (!isXBotConfigured()) {
      const errorMsg = "X/Twitter bot not configured - missing Twitter API credentials";
      console.error(errorMsg);
      return NextResponse.json(
        {
          success: false,
          error: errorMsg,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    // Check if OpenAI is configured (optional, will use fallback if not)
    const { isOpenAIConfigured } = await import("@/lib/ai-content-generator");
    if (!isOpenAIConfigured()) {
      console.log("OpenAI not configured, using fallback content");
    }

    // Generate 4 posts: crypto update, website promo, and 2 marketing posts
    console.log("Generating posts (crypto update, website promo, and 2 marketing posts)...");
    const posts = await generateDailyMarketingPosts();
    console.log(`Generated ${posts.length} posts`);

    // Post all tweets immediately (no delays to avoid Vercel timeout)
    // Twitter rate limits: 1,500 tweets/month, ~50/day
    // Posting 4 tweets at once is well within limits
    console.log("Posting tweets to X/Twitter (no delays to avoid timeout)...");
    const result = await postMultipleTweets(posts, 0); // No delay - post immediately

    const duration = Date.now() - startTime;

    if (result.success) {
      console.log("X Bot cron job completed successfully");
      return NextResponse.json({
        success: true,
        message: `Posted ${result.results.length} tweets successfully`,
        tweetsPosted: result.results.length,
        tweetIds: result.results
          .filter((r) => r.tweetId)
          .map((r) => r.tweetId),
        timestamp: new Date().toISOString(),
        duration: `${duration}ms`,
      });
    } else {
      console.error("Some tweets failed to post");
      return NextResponse.json(
        {
          success: false,
          error: "Some tweets failed to post",
          results: result.results,
          timestamp: new Date().toISOString(),
          duration: `${duration}ms`,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error("X Bot cron job error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
        duration: `${duration}ms`,
      },
      { status: 500 }
    );
  }
}

