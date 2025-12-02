# Supabase Setup Guide

This guide will help you set up Supabase for persistent storage of articles, referrals, and tweet tracking.

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account (or log in if you already have one)
3. Click "New Project"
4. Fill in your project details:
   - **Name**: DesignFi Studio (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Free tier is sufficient to start

## Step 2: Create the Database Tables

Once your project is created, go to the **SQL Editor** (left sidebar) and run the SQL scripts.

**Quick Setup (Recommended):**
- Copy and paste the entire contents of `SUPABASE_COMPLETE_SETUP.sql` into the SQL Editor
- Click "Run" to create all tables at once

**Or run the scripts individually below:**

### 2.1 Create Articles Table

```sql
-- Create articles table
CREATE TABLE articles (
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

-- Create index for faster queries
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read articles
CREATE POLICY "Anyone can read articles" ON articles
  FOR SELECT
  USING (true);

-- Create policy to allow anyone to insert articles (for publishing)
CREATE POLICY "Anyone can insert articles" ON articles
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow deletion (for admin panel)
-- Note: The API route will verify admin email before allowing deletion
CREATE POLICY "Anyone can delete articles" ON articles
  FOR DELETE
  USING (true);
```

### 2.2 Create Referrals Table

```sql
-- Create referrals table
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_wallet TEXT NOT NULL UNIQUE,
  referral_code TEXT NOT NULL UNIQUE,
  total_earnings BIGINT NOT NULL DEFAULT 0, -- in lamports
  total_referrals INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_referrals_referrer_wallet ON referrals(referrer_wallet);
CREATE INDEX idx_referrals_referral_code ON referrals(referral_code);

-- Enable Row Level Security (RLS)
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read referrals (for verification)
CREATE POLICY "Anyone can read referrals" ON referrals
  FOR SELECT
  USING (true);

-- Create policy to allow anyone to insert referrals
CREATE POLICY "Anyone can insert referrals" ON referrals
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow updates (for tracking earnings)
CREATE POLICY "Anyone can update referrals" ON referrals
  FOR UPDATE
  USING (true);
```

### 2.3 Create Referral Earnings Table

```sql
-- Create referral_earnings table
CREATE TABLE referral_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id UUID NOT NULL REFERENCES referrals(id) ON DELETE CASCADE,
  article_id UUID NOT NULL,
  publisher_wallet TEXT NOT NULL,
  amount BIGINT NOT NULL, -- in lamports (10% of payment)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_referral_earnings_referral_id ON referral_earnings(referral_id);
CREATE INDEX idx_referral_earnings_article_id ON referral_earnings(article_id);
CREATE INDEX idx_referral_earnings_created_at ON referral_earnings(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE referral_earnings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read earnings
CREATE POLICY "Anyone can read referral earnings" ON referral_earnings
  FOR SELECT
  USING (true);

-- Create policy to allow anyone to insert earnings
CREATE POLICY "Anyone can insert referral earnings" ON referral_earnings
  FOR INSERT
  WITH CHECK (true);
```

### 2.4 Create Posted Tweets Table (for duplicate detection)

```sql
-- Create posted_tweets table to track posted tweets and prevent duplicates
CREATE TABLE posted_tweets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  tweet_id TEXT,
  posted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on content_hash for faster duplicate checks
CREATE INDEX idx_posted_tweets_content_hash ON posted_tweets(content_hash);

-- Create index on posted_at for faster date-based queries
CREATE INDEX idx_posted_tweets_posted_at ON posted_tweets(posted_at);

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

## Step 3: Get Your API Keys

1. Go to **Project Settings** (gear icon in left sidebar)
2. Click on **API** in the settings menu
3. You'll see two important values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 4: Add Environment Variables

### For Local Development

1. Create or edit `.env.local` in your project root (if it doesn't exist)
2. Add these two lines:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Replace `xxxxx` and `eyJ...` with your actual values from Step 3.

**Important**: Make sure `.env.local` is in your `.gitignore` file (it should be by default in Next.js projects).

### For Vercel Deployment

1. Go to your Vercel project dashboard
2. Click on **Settings** → **Environment Variables**
3. Add the following two variables:

   **Variable 1:**
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: `https://xxxxx.supabase.co` (your Project URL)
   - **Environment**: Production, Preview, Development (select all)

   **Variable 2:**
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: `eyJ...` (your anon/public key)
   - **Environment**: Production, Preview, Development (select all)

4. Click **Save**
5. **Redeploy** your application for the changes to take effect

## Step 5: Verify Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Test the setup:
   - Try publishing an article - it should save to Supabase
   - Visit `/referrals` and connect your wallet - it should create a referral code
   - Check your Supabase dashboard → **Table Editor** to see if data is being saved

## Troubleshooting

### "Supabase environment variables are not set"
- Make sure your `.env.local` file exists and has the correct variable names
- Restart your development server after adding environment variables
- Check that there are no typos in the variable names

### "Error creating Supabase client"
- Verify your Project URL and anon key are correct
- Make sure there are no extra spaces or quotes in your `.env.local` file
- Check that your Supabase project is active (not paused)

### Tables not found
- Make sure you ran all the SQL scripts in Step 2
- Check the **Table Editor** in Supabase to verify tables exist
- Verify RLS policies are enabled and configured correctly

### Data not persisting
- Check the Supabase **Logs** (left sidebar) for any errors
- Verify your RLS policies allow INSERT operations
- Make sure you're using the correct table names (snake_case in database)

## Security Notes

- The `anon/public` key is safe to use in client-side code (it's public)
- Row Level Security (RLS) policies control who can read/write data
- Never commit your `.env.local` file to git
- For production, consider using service role key for server-side operations (not needed for this setup)

## Next Steps

Once Supabase is set up:
- ✅ Articles will persist across deployments
- ✅ Referral codes and earnings will be stored permanently
- ✅ Posted tweets will be tracked to prevent duplicates
- ✅ All data will be accessible from any device
- ✅ You can view and manage data in the Supabase dashboard

Need help? Check the [Supabase Documentation](https://supabase.com/docs) or the [REFERRAL_SYSTEM_SETUP.md](./REFERRAL_SYSTEM_SETUP.md) for more details.
