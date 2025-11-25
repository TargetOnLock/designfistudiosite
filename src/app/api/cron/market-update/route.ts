import { NextRequest, NextResponse } from "next/server";
import { sendMarketUpdateToTelegram } from "@/lib/telegram-bot";

/**
 * Cron job endpoint for sending market updates to Telegram
 * This should be called every 6 hours via Vercel Cron Jobs
 * 
 * To set up in Vercel:
 * 1. Go to your project settings
 * 2. Navigate to "Cron Jobs"
 * 3. Add a new cron job:
 *    - Path: /api/cron/market-update
 *    - Schedule: 0 */6 * * * (every 6 hours)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron (optional security check)
    const authHeader = request.headers.get("authorization");
    if (process.env.CRON_SECRET) {
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    console.log("Starting market update cron job...");

    // Send market update to Telegram
    const result = await sendMarketUpdateToTelegram();

    if (result.success) {
      console.log("Market update sent successfully:", result.messageId);
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.error("Failed to send market update:", result.error);
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in market update cron job:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

