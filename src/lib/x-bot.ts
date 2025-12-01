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
): Promise<{ success: boolean; tweetId?: string; error?: string }> {
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
    let errorCode = error?.code;
    let errorData = error?.data;
    
    // Handle Twitter API v2 errors
    if (error?.code === 403) {
      errorMessage = "403 Forbidden - Check that your Twitter app has Read and Write permissions and Elevated access. See X_BOT_TROUBLESHOOTING.md for details.";
    } else if (error?.code === 401) {
      errorMessage = "401 Unauthorized - Check that your Twitter API credentials are correct.";
    } else if (errorData) {
      errorMessage = `${errorMessage} (Details: ${JSON.stringify(errorData)})`;
    }
    
    return { success: false, error: errorMessage, errorCode };
  }
}

/**
 * Post multiple tweets with delays between them
 */
export async function postMultipleTweets(
  tweets: string[],
  delayMs: number = 30000 // 30 seconds default delay
): Promise<{ success: boolean; results: Array<{ success: boolean; tweetId?: string; error?: string }> }> {
  const results: Array<{ success: boolean; tweetId?: string; error?: string }> = [];

  for (let i = 0; i < tweets.length; i++) {
    const result = await postTweet(tweets[i]);
    results.push(result);

    // Wait before posting next tweet (except for the last one)
    if (i < tweets.length - 1) {
      console.log(`Waiting ${delayMs / 1000} seconds before next tweet...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  const allSuccessful = results.every((r) => r.success);
  return { success: allSuccessful, results };
}

