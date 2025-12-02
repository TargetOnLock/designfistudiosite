-- ============================================================================
-- DesignFi Studio - Complete Supabase Database Setup
-- ============================================================================
-- This file contains all SQL scripts needed to set up the database for:
-- - Articles (self-publishing platform)
-- - Referrals (referral system with earnings tracking)
-- - Posted Tweets (X/Twitter bot duplicate detection)
-- ============================================================================
-- Instructions:
-- 1. Go to your Supabase project dashboard
-- 2. Click on "SQL Editor" in the left sidebar
-- 3. Click "New Query"
-- 4. Copy and paste this entire file
-- 5. Click "Run" (or press Ctrl+Enter)
--
-- Note: This script is safe to run multiple times. It uses IF NOT EXISTS
-- for tables and indexes, and will recreate policies if they already exist.
-- ============================================================================

-- ============================================================================
-- 1. ARTICLES TABLE
-- ============================================================================
-- Stores self-published articles with all metadata

CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT NOT NULL,
  telegram_link TEXT,
  twitter_link TEXT,
  website_link TEXT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  author TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster queries by publication date
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can read articles" ON articles;
DROP POLICY IF EXISTS "Anyone can insert articles" ON articles;
DROP POLICY IF EXISTS "Anyone can delete articles" ON articles;

-- Policy: Allow anyone to read articles
CREATE POLICY "Anyone can read articles" ON articles
  FOR SELECT
  USING (true);

-- Policy: Allow anyone to insert articles (for publishing)
CREATE POLICY "Anyone can insert articles" ON articles
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow deletion (for admin panel)
-- Note: The API route will verify admin email before allowing deletion
CREATE POLICY "Anyone can delete articles" ON articles
  FOR DELETE
  USING (true);

-- ============================================================================
-- 2. REFERRALS TABLE
-- ============================================================================
-- Stores referral codes and tracks total earnings/referrals per wallet

CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_wallet TEXT NOT NULL UNIQUE,
  referral_code TEXT NOT NULL UNIQUE,
  total_earnings BIGINT NOT NULL DEFAULT 0, -- in lamports
  total_referrals INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_wallet ON referrals(referrer_wallet);
CREATE INDEX IF NOT EXISTS idx_referrals_referral_code ON referrals(referral_code);

-- Enable Row Level Security (RLS)
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can read referrals" ON referrals;
DROP POLICY IF EXISTS "Anyone can insert referrals" ON referrals;
DROP POLICY IF EXISTS "Anyone can update referrals" ON referrals;

-- Policy: Allow anyone to read referrals (for verification)
CREATE POLICY "Anyone can read referrals" ON referrals
  FOR SELECT
  USING (true);

-- Policy: Allow anyone to insert referrals
CREATE POLICY "Anyone can insert referrals" ON referrals
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow updates (for tracking earnings)
CREATE POLICY "Anyone can update referrals" ON referrals
  FOR UPDATE
  USING (true);

-- ============================================================================
-- 3. REFERRAL EARNINGS TABLE
-- ============================================================================
-- Tracks individual referral earnings per article publication

CREATE TABLE IF NOT EXISTS referral_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id UUID NOT NULL REFERENCES referrals(id) ON DELETE CASCADE,
  article_id UUID NOT NULL,
  publisher_wallet TEXT NOT NULL,
  amount BIGINT NOT NULL, -- in lamports (10% of payment)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_referral_earnings_referral_id ON referral_earnings(referral_id);
CREATE INDEX IF NOT EXISTS idx_referral_earnings_article_id ON referral_earnings(article_id);
CREATE INDEX IF NOT EXISTS idx_referral_earnings_created_at ON referral_earnings(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE referral_earnings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can read referral earnings" ON referral_earnings;
DROP POLICY IF EXISTS "Anyone can insert referral earnings" ON referral_earnings;

-- Policy: Allow anyone to read earnings
CREATE POLICY "Anyone can read referral earnings" ON referral_earnings
  FOR SELECT
  USING (true);

-- Policy: Allow anyone to insert earnings
CREATE POLICY "Anyone can insert referral earnings" ON referral_earnings
  FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- 4. POSTED TWEETS TABLE
-- ============================================================================
-- Tracks posted tweets to prevent duplicate posts (X/Twitter bot)

CREATE TABLE IF NOT EXISTS posted_tweets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  tweet_id TEXT,
  posted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on content_hash for faster duplicate checks
CREATE INDEX IF NOT EXISTS idx_posted_tweets_content_hash ON posted_tweets(content_hash);

-- Index on posted_at for faster date-based queries
CREATE INDEX IF NOT EXISTS idx_posted_tweets_posted_at ON posted_tweets(posted_at);

-- Enable Row Level Security (RLS)
ALTER TABLE posted_tweets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can read posted tweets" ON posted_tweets;
DROP POLICY IF EXISTS "Anyone can insert posted tweets" ON posted_tweets;

-- Policy: Allow anyone to read posted tweets (for duplicate checking)
CREATE POLICY "Anyone can read posted tweets" ON posted_tweets
  FOR SELECT
  USING (true);

-- Policy: Allow anyone to insert posted tweets
CREATE POLICY "Anyone can insert posted tweets" ON posted_tweets
  FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================
-- All tables, indexes, and policies have been created.
-- 
-- Next steps:
-- 1. Get your Supabase API keys from Project Settings → API
-- 2. Add them to your .env.local file:
--    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
--    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
-- 3. Add the same variables to Vercel environment variables
-- 4. Redeploy your application
-- ============================================================================

