# Market Update Cron Job Setup

The Telegram bot will automatically post crypto market updates every 6 hours to your channel.

## What It Does

Once per day (at 12:00 UTC), the bot will post:
- 📊 Global market data (total market cap, 24h volume, market change)
- 💰 Top 20 cryptocurrencies with prices and 24h changes
- 📈 Market sentiment (bullish/bearish/neutral)
- 🎯 Gainers vs losers count
- 🕐 Timestamp of the update

## Setup

### Automatic Setup (Vercel)

The `vercel.json` file is already configured with the cron job schedule:
- **Schedule:** Once per day at 12:00 UTC (`0 12 * * *`)
- **Endpoint:** `/api/cron/market-update`

**Note:** Vercel Hobby plan limits cron jobs to once per day. If you need more frequent updates, upgrade to Pro plan.

When you deploy to Vercel, the cron job will be automatically set up.

### Manual Setup (if needed)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Cron Jobs**
3. Add a new cron job:
   - **Path:** `/api/cron/market-update`
   - **Schedule:** `0 12 * * *` (once per day at 12:00 UTC)
   - **Timezone:** UTC (default)

### Schedule Format

The cron schedule `0 12 * * *` means:
- `0` - At minute 0
- `12` - At hour 12 (12:00 PM)
- `*` - Every day of month
- `*` - Every month
- `*` - Every day of week

This will run once per day at: **12:00 UTC** (noon UTC)

**Vercel Hobby Plan Limitation:**
- Hobby plan allows only **1 cron job per day**
- To run more frequently (e.g., every 6 hours), upgrade to **Pro plan**

### Optional: Add Security

To secure your cron endpoint, you can add a `CRON_SECRET` environment variable:

1. Generate a random secret (e.g., `openssl rand -hex 32`)
2. Add to Vercel environment variables:
   - **Name:** `CRON_SECRET`
   - **Value:** Your generated secret
3. Vercel will automatically add this as an `Authorization: Bearer <secret>` header

## Testing

### Test Immediately After Deployment

**You can test the market update right away!** Just visit this URL in your browser:

```
https://your-domain.vercel.app/api/cron/market-update
```

This will:
1. Fetch current crypto prices
2. Format the market update
3. Post to your Telegram channel immediately
4. Return a JSON response

**No need to wait for the scheduled time!** You can test it anytime by visiting the URL.

### Test Locally

You can also test locally:

```bash
# Start dev server
npm run dev

# Test the endpoint
curl http://localhost:3000/api/cron/market-update
```

### Check Your Telegram Channel

After testing, check your Telegram channel [@DesignFiStudio](https://t.me/DesignFiStudio) - you should see the market update message!

## Data Source

- **API:** CoinGecko (free tier)
- **Update Frequency:** Once per day (12:00 UTC)
- **Data Cached:** 5 minutes (to avoid rate limits)

## Features

✅ Top 20 cryptocurrencies with prices  
✅ 24-hour price changes with emojis  
✅ Global market data  
✅ Market sentiment analysis  
✅ Formatted with emojis for better readability  
✅ Automatic posting once per day (12:00 UTC)  

## Troubleshooting

### Cron Job Not Running?

1. **Check Vercel Dashboard:**
   - Go to your project → **Settings** → **Cron Jobs**
   - Verify the cron job is listed and enabled
   - Check the last run time and status

2. **Verify Schedule:**
   - The schedule should be: `0 */6 * * *`
   - This runs at: 00:00, 06:00, 12:00, 18:00 UTC

3. **Check Function Logs:**
   - Go to **Deployments** → Click on your latest deployment
   - Click **Functions** → Find `/api/cron/market-update`
   - Check the logs for errors

4. **Environment Variables:**
   - Verify `TELEGRAM_BOT_TOKEN` is set in Vercel
   - Verify `TELEGRAM_CHANNEL_ID` is set in Vercel
   - Make sure they're set for **Production** environment

### No Messages in Telegram?

1. **Test Manually First:**
   - Visit: `https://your-domain.vercel.app/api/cron/market-update`
   - Check the response - it should show `success: true` or an error message
   - Check Vercel function logs for detailed error messages

2. **Verify Bot Configuration:**
   - Check `TELEGRAM_BOT_TOKEN` is correct (no extra spaces)
   - Check `TELEGRAM_CHANNEL_ID` is correct:
     - For public channels: `@DesignFiStudio` (with @)
     - For private channels: `-1001234567890` (numeric ID)

3. **Check Bot Permissions:**
   - The bot must be an **Administrator** in the channel
   - The bot must have permission to **Post Messages**

4. **Check Logs:**
   - The function now includes detailed logging
   - Look for messages like:
     - "Starting market update fetch..."
     - "Fetched X cryptocurrencies"
     - "Sending message to Telegram..."
     - Any error messages

5. **Common Issues:**
   - **"Telegram bot not configured"** → Environment variables not set
   - **"Unauthorized"** → Bot not admin or wrong channel ID
   - **"Bad Request"** → Message too long or invalid format
   - **CoinGecko API errors** → Rate limiting or API issues

### Rate Limits?

CoinGecko free tier has rate limits. The code includes caching to minimize requests. If you hit limits:
- Consider upgrading to CoinGecko Pro
- Or reduce the frequency of updates

## Customization

You can customize:
- **Update frequency:** Change the schedule in `vercel.json` (Hobby plan limited to once per day)
- **Update time:** Change `12` in `0 12 * * *` to your preferred hour (0-23 UTC)
- **Number of cryptos:** Edit `fetchTopCryptos(20)` in the cron route
- **Message format:** Edit `formatCryptoPricesMessage()` in `src/lib/crypto-prices.ts`

**To run more than once per day:**
- Upgrade to Vercel Pro plan
- Then change schedule to `0 */6 * * *` for every 6 hours

