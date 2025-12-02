# Tweet Tracker Setup

This document explains how the tweet tracker works to prevent duplicate tweets.

## Supabase Table Setup

**Note:** If you're using Supabase, the `posted_tweets` table is already included in the main `SUPABASE_SETUP.md` file. You can add it to your existing Supabase database by running the SQL script in section 2.4 of that file.

If you need to add it separately, here's the SQL:

```sql
-- Create posted_tweets table
CREATE TABLE IF NOT EXISTS posted_tweets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  tweet_id TEXT,
  posted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on content_hash for faster duplicate checks
CREATE INDEX IF NOT EXISTS idx_posted_tweets_content_hash ON posted_tweets(content_hash);

-- Create index on posted_at for faster date-based queries
CREATE INDEX IF NOT EXISTS idx_posted_tweets_posted_at ON posted_tweets(posted_at);

-- Enable Row Level Security (RLS)
ALTER TABLE posted_tweets ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read posted tweets (for duplicate checking)
CREATE POLICY "Anyone can read posted tweets" ON posted_tweets
  FOR SELECT
  USING (true);

-- Create policy to allow anyone to insert posted tweets
CREATE POLICY "Anyone can insert posted tweets" ON posted_tweets
  FOR INSERT
  WITH CHECK (true);
```

## How It Works

1. **Duplicate Detection**: Before posting, the system checks if a tweet with the same content hash has been posted in the last 30 days.

2. **Content Hashing**: Tweets are normalized (trimmed, lowercased, whitespace normalized) and hashed for comparison.

3. **Automatic Regeneration**: If a duplicate is detected, the system automatically regenerates the tweet (up to 3 attempts).

4. **Storage**: Posted tweets are stored in Supabase (if configured) or in-memory (as fallback).

5. **Recording**: After successful posting, tweets are recorded to prevent future duplicates.

## Fallback Behavior

If Supabase is not configured, the system uses in-memory storage:
- Stores up to 1000 recent tweets
- Only persists during the current serverless function execution
- Resets on each deployment (not ideal for production)

**Recommendation**: Set up Supabase for persistent duplicate tracking.

## Environment Variables

Make sure you have these environment variables set (if using Supabase):

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Or:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Testing

After setting up the table, test the duplicate detection by:

1. Running the cron job once
2. Running it again immediately - it should detect duplicates and regenerate
3. Check the logs to see duplicate detection in action

