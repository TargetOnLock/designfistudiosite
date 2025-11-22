# Adding Referral Tables to Existing Supabase Setup

Since you already have Supabase configured for articles, you just need to add the referral tables.

## Step 1: Go to Supabase SQL Editor

1. Open your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**

## Step 2: Run These SQL Scripts

Copy and paste these SQL scripts one at a time (or all together):

### Create Referrals Table

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

### Create Referral Earnings Table

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

## Step 3: Verify Tables Were Created

1. Go to **Table Editor** in the left sidebar
2. You should now see three tables:
   - `articles` (already existed)
   - `referrals` (new)
   - `referral_earnings` (new)

## That's It!

Your referral system is now ready to use. The existing Supabase environment variables will work for referrals too - no need to change anything in your `.env.local` or Vercel settings.

Test it by:
1. Visiting `/referrals` and connecting your wallet
2. Your referral code will be automatically created
3. Share your referral link and start earning!

