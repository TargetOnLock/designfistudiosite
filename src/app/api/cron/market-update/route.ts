import { NextRequest, NextResponse } from "next/server";
import { sendMarketUpdateToTelegram } from "@/lib/telegram-bot";

// Set runtime to edge for better performance (optional)
export const runtime = 'nodejs';

/**
 * Cron job endpoint for sending market updates to Telegram
 * 
 * This endpoint:
 * - Can be called manually anytime to test: GET /api/cron/market-update
 * - Runs automatically once per day at 12:00 UTC via Vercel Cron Jobs
 * 
 * To test immediately after deployment:
 * Just visit: https://your-domain.vercel.app/api/cron/market-update
 * 
 * Cron schedule: 0 12 * * * (once per day at 12:00 UTC)
 * 
 * Note: Vercel Hobby plan limits to 1 cron job per day.
 * For more frequent updates, upgrade to Pro plan.
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  console.log("=".repeat(50));
  console.log("Market Update Cron Job Started");
  console.log("Timestamp:", new Date().toISOString());
  console.log("=".repeat(50));

  try {
    // Verify the request is from Vercel Cron (optional security check)
    const authHeader = request.headers.get("authorization");
    if (process.env.CRON_SECRET) {
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        console.error("Unauthorized: Invalid CRON_SECRET");
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    // Check environment variables
    const hasBotToken = !!process.env.TELEGRAM_BOT_TOKEN;
    const hasChannelId = !!process.env.TELEGRAM_CHANNEL_ID;
    
    console.log("Environment check:");
    console.log("- TELEGRAM_BOT_TOKEN:", hasBotToken ? "✓ Set" : "✗ Missing");
    console.log("- TELEGRAM_CHANNEL_ID:", hasChannelId ? "✓ Set" : "✗ Missing");
    
    if (!hasBotToken || !hasChannelId) {
      const error = "Missing required environment variables: TELEGRAM_BOT_TOKEN or TELEGRAM_CHANNEL_ID";
      console.error(error);
      return NextResponse.json(
        {
          success: false,
          error,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    // Send market update to Telegram
    const result = await sendMarketUpdateToTelegram();

    const duration = Date.now() - startTime;
    console.log("=".repeat(50));
    console.log("Market Update Cron Job Completed");
    console.log("Duration:", `${duration}ms`);
    console.log("Success:", result.success);
    console.log("=".repeat(50));

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        timestamp: new Date().toISOString(),
        duration: `${duration}ms`,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          timestamp: new Date().toISOString(),
          duration: `${duration}ms`,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error("=".repeat(50));
    console.error("Market Update Cron Job Error");
    console.error("Error:", error);
    console.error("Duration:", `${duration}ms`);
    console.error("=".repeat(50));
    
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

