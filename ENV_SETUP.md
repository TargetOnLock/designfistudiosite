# Environment Variables Setup

## Important: Keep Secrets Safe!

**Never commit sensitive tokens or keys to git.** All `.env*` files are already in `.gitignore`.

## Required Environment Variables

### For Local Development

Create a `.env.local` file in your project root with:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHANNEL_ID=@DesignFiStudio

# X/Twitter Bot Configuration
TWITTER_API_KEY=your_twitter_api_key_here
TWITTER_API_SECRET=your_twitter_api_secret_here
TWITTER_ACCESS_TOKEN=your_twitter_access_token_here
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret_here
TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here

# OpenAI API Key (Optional - for AI-generated X bot content)
OPENAI_API_KEY=sk-your_openai_api_key_here

# Supabase Configuration (if using)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Admin Email (for admin panel access)
ADMIN_EMAIL=your_admin_email@example.com

# Solana RPC URL (optional)
NEXT_PUBLIC_SOLANA_RPC_URL=https://rpc.ankr.com/solana
```

### For Vercel (Production)

Add these in Vercel Dashboard → Settings → Environment Variables:

**Telegram Bot:**
- `TELEGRAM_BOT_TOKEN` - Your Telegram bot token
- `TELEGRAM_CHANNEL_ID` - Your Telegram channel ID (e.g., `@DesignFiStudio`)

**X/Twitter Bot:**
- `TWITTER_API_KEY` - Your Twitter API Key
- `TWITTER_API_SECRET` - Your Twitter API Secret
- `TWITTER_ACCESS_TOKEN` - Your Twitter Access Token
- `TWITTER_ACCESS_TOKEN_SECRET` - Your Twitter Access Token Secret
- `TWITTER_BEARER_TOKEN` - Your Twitter Bearer Token
- `OPENAI_API_KEY` - Your OpenAI API Key (optional, for AI-generated content)

**Supabase (if using):**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

**Admin Panel:**
- `ADMIN_EMAIL` - Your admin email address (for accessing `/admin` page)

**Optional:**
- `NEXT_PUBLIC_SOLANA_RPC_URL` - Custom Solana RPC endpoint

## Your Current Values

**⚠️ IMPORTANT:** These should only be in your environment variables, NOT in code:

- Bot Token: Get from [@BotFather](https://t.me/BotFather)
- Channel ID: `@DesignFiStudio`

## Security Notes

- ✅ `.env.local` is in `.gitignore` - safe to create locally
- ✅ Never commit `.env.local` to git
- ✅ Use Vercel environment variables for production
- ❌ Never put tokens in code files
- ❌ Never commit tokens to git

