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

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## Step 5: Deploy

After adding the environment variables:
- If using Vercel: Add them in your Vercel project settings under Environment Variables
- If deploying elsewhere: Make sure to set these environment variables in your hosting platform

## Notes

- The app will automatically use Supabase if these environment variables are set
- If not set, it will fall back to in-memory storage (which resets on deployment)
- The free tier of Supabase is sufficient for most use cases
- Articles will persist across deployments once Supabase is configured

