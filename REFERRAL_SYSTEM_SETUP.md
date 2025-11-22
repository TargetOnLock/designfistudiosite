# Referral System Setup Guide

The referral system allows users to earn 10% commission from article publications made through their referral links.

## Database Schema

If you're using Supabase, you need to create the following tables:

### 1. Referrals Table

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

### 2. Referral Earnings Table

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

## How It Works

1. **Referral Link Generation**: When a user connects their wallet and visits `/referrals`, a unique referral code is generated based on their wallet address.

2. **Sharing Referral Links**: Users can copy their referral link which looks like:
   ```
   https://designfi.studio/articles/publish?ref=ABC123XYZ
   ```

3. **Tracking Referrals**: When someone publishes an article using a referral link:
   - The referral code is detected from the URL parameter
   - After successful payment and article publication, a referral earning is recorded
   - The referrer earns 10% of the payment amount (in lamports)

4. **Earnings Tracking**: All earnings are tracked in the database and displayed in the referral dashboard.

## Features

- ✅ Automatic referral code generation
- ✅ 10% commission on each referral
- ✅ Real-time earnings tracking
- ✅ Referral dashboard with stats
- ✅ Earnings history
- ✅ Works with both Supabase and in-memory storage (fallback)

## API Endpoints

### GET `/api/referrals?wallet={wallet}`
Get or create referral data for a wallet address.

### GET `/api/referrals?code={code}`
Look up a referral by code.

### POST `/api/referrals`
Record a referral earning after article publication.

## Usage

1. Users visit `/referrals` and connect their wallet
2. They get a unique referral link
3. They share the link with others
4. When someone publishes using the link, the referrer automatically earns 10%
5. Earnings are displayed in the referral dashboard

## Notes

- Referral earnings are calculated as 10% of the payment amount in lamports
- Free publishing wallets don't generate referral earnings
- The system works with both Supabase (persistent) and in-memory storage (temporary)

