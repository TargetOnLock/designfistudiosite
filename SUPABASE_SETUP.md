# Supabase Setup Guide

To enable persistent article storage across deployments, you need to set up a Supabase database.

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

## Step 2: Create the Articles Table

Once your project is created, go to the SQL Editor and run this SQL:

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
```

## Step 3: Get Your API Keys

1. Go to Project Settings → API
2. Copy your:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 4: Add Environment Variables

### For Local Development

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### For Vercel Deployment

1. Go to your Vercel project dashboard
2. Click on **Settings** → **Environment Variables**
3. Add the following two variables:

   **Variable 1:**
   - **Key:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** Your Supabase Project URL (from Step 3)
   - **Environment:** Select all (Production, Preview, Development)

   **Variable 2:**
   - **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value:** Your Supabase anon/public key (from Step 3)
   - **Environment:** Select all (Production, Preview, Development)

4. Click **Save** for each variable
5. **Important:** After adding the variables, you need to redeploy:
   - Go to **Deployments** tab
   - Click the **⋯** (three dots) on your latest deployment
   - Click **Redeploy** (or push a new commit to trigger a new deployment)

## Step 5: Verify

After redeploying, your articles should now persist across deployments. You can test by:
1. Publishing a new article
2. Waiting for deployment to complete
3. Refreshing the page - the article should still be there

## Notes

- The app will automatically use Supabase if these environment variables are set
- If not set, it will fall back to in-memory storage (which resets on deployment)
- The free tier of Supabase is sufficient for most use cases
- Articles will persist across deployments once Supabase is configured

