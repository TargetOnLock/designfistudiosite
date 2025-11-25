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

# Supabase Configuration (if using)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Solana RPC URL (optional)
NEXT_PUBLIC_SOLANA_RPC_URL=https://rpc.ankr.com/solana
```

### For Vercel (Production)

Add these in Vercel Dashboard → Settings → Environment Variables:

- `TELEGRAM_BOT_TOKEN` - Your Telegram bot token
- `TELEGRAM_CHANNEL_ID` - Your Telegram channel ID (e.g., `@DesignFiStudio`)
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL (if using)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key (if using)
- `NEXT_PUBLIC_SOLANA_RPC_URL` - Optional custom Solana RPC endpoint

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

