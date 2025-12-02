/**
 * Tweet Tracker - Prevents duplicate tweets
 * Stores posted tweets and checks for duplicates before posting
 */

import { createClient } from "@supabase/supabase-js";

interface PostedTweet {
  id: string;
  content: string;
  content_hash: string;
  tweet_id?: string;
  posted_at: string;
}

// In-memory store as fallback
const postedTweetsStore: PostedTweet[] = [];

/**
 * Get Supabase client (if configured)
 */
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
}

/**
 * Create a hash of tweet content for duplicate detection
 * Normalizes content to catch near-duplicates (different spacing, case, etc.)
 * but preserves emojis and important formatting
 */
function hashTweetContent(content: string): string {
  // Normalize: trim, lowercase, normalize whitespace
  // Keep emojis and important characters (#, @, $) but normalize spacing
  let normalized = content
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ") // Replace multiple spaces/newlines with single space
    .replace(/\n+/g, " ") // Replace newlines with spaces
    .trim();
  
  // Create a hash using the normalized content
  // Use first 150 chars + total length for uniqueness
  // This catches duplicates even if they have minor formatting differences
  const hash = `${normalized.substring(0, 150)}_${normalized.length}`;
  return hash;
}

/**
 * Check if a tweet has been posted recently (within last 30 days)
 */
export async function hasTweetBeenPosted(content: string): Promise<boolean> {
  const contentHash = hashTweetContent(content);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("posted_tweets")
        .select("id")
        .eq("content_hash", contentHash)
        .gte("posted_at", thirtyDaysAgo.toISOString())
        .limit(1);

      if (error) {
        console.error("Error checking posted tweets:", error);
        // Fall back to in-memory check
        return checkInMemoryStore(contentHash, thirtyDaysAgo);
      }

      return (data && data.length > 0) || false;
    } catch (error) {
      console.error("Error querying Supabase for posted tweets:", error);
      return checkInMemoryStore(contentHash, thirtyDaysAgo);
    }
  }

  return checkInMemoryStore(contentHash, thirtyDaysAgo);
}

/**
 * Check in-memory store for duplicates
 */
function checkInMemoryStore(contentHash: string, cutoffDate: Date): boolean {
  return postedTweetsStore.some(
    (tweet) =>
      tweet.content_hash === contentHash &&
      new Date(tweet.posted_at) >= cutoffDate
  );
}

/**
 * Record a posted tweet
 */
export async function recordPostedTweet(
  content: string,
  tweetId?: string
): Promise<void> {
  const contentHash = hashTweetContent(content);
  const postedTweet: PostedTweet = {
    id: crypto.randomUUID(),
    content: content.substring(0, 500), // Store first 500 chars
    content_hash: contentHash,
    tweet_id: tweetId,
    posted_at: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { error } = await supabase.from("posted_tweets").insert([postedTweet]);

      if (error) {
        console.error("Error recording posted tweet:", error);
        // Fall back to in-memory store
        postedTweetsStore.push(postedTweet);
        // Keep only last 1000 tweets in memory
        if (postedTweetsStore.length > 1000) {
          postedTweetsStore.shift();
        }
      }
    } catch (error) {
      console.error("Error inserting posted tweet to Supabase:", error);
      // Fall back to in-memory store
      postedTweetsStore.push(postedTweet);
      if (postedTweetsStore.length > 1000) {
        postedTweetsStore.shift();
      }
    }
  } else {
    // Use in-memory store
    postedTweetsStore.push(postedTweet);
    if (postedTweetsStore.length > 1000) {
      postedTweetsStore.shift();
    }
  }
}

/**
 * Filter out duplicate tweets and return only unique ones
 */
export async function filterDuplicateTweets(
  tweets: string[]
): Promise<string[]> {
  const uniqueTweets: string[] = [];

  for (const tweet of tweets) {
    const isDuplicate = await hasTweetBeenPosted(tweet);
    if (!isDuplicate) {
      uniqueTweets.push(tweet);
    } else {
      console.log("Skipping duplicate tweet:", tweet.substring(0, 50) + "...");
    }
  }

  return uniqueTweets;
}

