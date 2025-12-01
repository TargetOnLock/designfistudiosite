/**
 * X (Twitter) Bot utility for posting marketing content
 */

import { TwitterApi } from "twitter-api-v2";

/**
 * Check if X/Twitter bot is configured
 */
export function isXBotConfigured(): boolean {
  return !!(
    process.env.TWITTER_API_KEY &&
    process.env.TWITTER_API_SECRET &&
    process.env.TWITTER_ACCESS_TOKEN &&
    process.env.TWITTER_ACCESS_TOKEN_SECRET &&
    process.env.TWITTER_BEARER_TOKEN
  );
}

/**
 * Initialize Twitter API client
 */
function getTwitterClient() {
  if (!isXBotConfigured()) {
    throw new Error("Twitter API credentials not configured");
  }

  return new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!,
    appSecret: process.env.TWITTER_API_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
  });
}

/**
 * Post a tweet to X/Twitter
 */
export async function postTweet(
  text: string
): Promise<{ success: boolean; tweetId?: string; error?: string; errorCode?: number }> {
  if (!isXBotConfigured()) {
    console.log("X/Twitter bot not configured, skipping tweet");
    return { success: false, error: "X/Twitter bot not configured" };
  }

  try {
    const client = getTwitterClient();
    const rwClient = client.readWrite;

    // Ensure tweet is within character limit (280 for X)
    const tweetText = text.length > 280 ? text.substring(0, 277) + "..." : text;

    const tweet = await rwClient.v2.tweet({
      text: tweetText,
    });

    console.log("Tweet posted successfully:", tweet.data.id);
    return { success: true, tweetId: tweet.data.id };
  } catch (error: any) {
    console.error("Error posting tweet:", error);
    
    // Extract more detailed error information
    let errorMessage = error instanceof Error ? error.message : String(error);
    let errorCode = error?.code || error?.status;
    let errorData = error?.data;
    
    // Handle Twitter API v2 errors
    if (errorCode === 403) {
      errorMessage = "403 Forbidden - Check that your Twitter app has Read and Write permissions and Elevated access. See X_BOT_TROUBLESHOOTING.md for details.";
    } else if (errorCode === 401) {
      errorMessage = "401 Unauthorized - Check that your Twitter API credentials are correct.";
    } else if (errorCode === 429) {
      errorMessage = "429 Too Many Requests - Twitter rate limit exceeded. Wait before trying again. Rate limits reset every 15 minutes.";
    } else if (errorData) {
      errorMessage = `${errorMessage} (Details: ${JSON.stringify(errorData)})`;
    }
    
    return { success: false, error: errorMessage, errorCode };
  }
}

/**
 * Post multiple tweets with optional delays between them
 * Includes retry logic for rate limits
 */
export async function postMultipleTweets(
  tweets: string[],
  delayMs: number = 0 // Default no delay to avoid Vercel timeout
): Promise<{ success: boolean; results: Array<{ success: boolean; tweetId?: string; error?: string; errorCode?: number }> }> {
  const results: Array<{ success: boolean; tweetId?: string; error?: string; errorCode?: number }> = [];

  for (let i = 0; i < tweets.length; i++) {
    let result = await postTweet(tweets[i]);
    
    // If rate limited (429), skip remaining tweets
    if (result.errorCode === 429) {
      console.log("Rate limit exceeded. Stopping further posts. Remaining tweets will be skipped.");
      results.push(result);
      // Fill remaining slots with rate limit errors
      for (let j = i + 1; j < tweets.length; j++) {
        results.push({
          success: false,
          error: "429 Rate limit exceeded - skipped to avoid further rate limiting",
          errorCode: 429,
        });
      }
      break;
    }
    
    results.push(result);

    // Wait before posting next tweet (only if delay is specified and not the last tweet)
    if (delayMs > 0 && i < tweets.length - 1) {
      console.log(`Waiting ${delayMs / 1000} seconds before next tweet...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  const allSuccessful = results.every((r) => r.success);
  return { success: allSuccessful, results };
}

