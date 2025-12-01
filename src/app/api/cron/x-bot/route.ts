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
import { sendTweetLinksToTelegram } from "@/lib/telegram-bot";

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

    // Post tweets with maximum delay possible while staying under Vercel's 10-second timeout (Hobby plan)
    // Calculation: ~2s content generation + ~4s (4 tweets × 1s) + 3 delays = ~6s + 3X < 10s
    // Maximum delay: ~1.3 seconds per delay (3 × 1.3 = 3.9s, total ~9.9s - safe margin)
    // Using 1300ms (1.3 seconds) - maximum delay without upgrading Vercel
    console.log("Posting tweets to X/Twitter with 1.3-second delays (maximum for Hobby plan)...");
    const result = await postMultipleTweets(posts, 1300); // 1.3 seconds between tweets - maximum delay for 10s timeout

    // Collect successful tweet links
    const successfulTweets = result.results
      .filter((r) => r.success && r.tweetId && r.tweetUrl)
      .map((r, index) => ({
        text: posts[index] || "Tweet",
        url: r.tweetUrl!,
      }));

    // Send tweet links to Telegram if any tweets were posted successfully
    if (successfulTweets.length > 0) {
      console.log(`Sending ${successfulTweets.length} tweet links to Telegram...`);
      try {
        const telegramResult = await sendTweetLinksToTelegram(successfulTweets);
        if (telegramResult.success) {
          console.log("Tweet links sent to Telegram successfully");
        } else {
          console.error("Failed to send tweet links to Telegram:", telegramResult.error);
        }
      } catch (error) {
        console.error("Error sending tweet links to Telegram:", error);
        // Don't fail the entire job if Telegram fails
      }
    }

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
        tweetUrls: result.results
          .filter((r) => r.tweetUrl)
          .map((r) => r.tweetUrl),
        telegramSent: successfulTweets.length > 0,
        timestamp: new Date().toISOString(),
        duration: `${duration}ms`,
      });
    } else {
      console.error("Some tweets failed to post");
      const rateLimited = result.results.some((r) => r.errorCode === 429);
      const errorMessage = rateLimited
        ? "Rate limit exceeded. Twitter rate limits reset every 15 minutes. Wait before trying again."
        : "Some tweets failed to post";
      
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          results: result.results,
          rateLimited,
          timestamp: new Date().toISOString(),
          duration: `${duration}ms`,
        },
        { status: rateLimited ? 429 : 500 }
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

