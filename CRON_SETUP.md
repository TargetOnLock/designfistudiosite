# Market Update Cron Job Setup

The Telegram bot will automatically post crypto market updates every 6 hours to your channel.

## What It Does

Every 6 hours, the bot will post:
- 📊 Global market data (total market cap, 24h volume, market change)
- 💰 Top 20 cryptocurrencies with prices and 24h changes
- 📈 Market sentiment (bullish/bearish/neutral)
- 🎯 Gainers vs losers count
- 🕐 Timestamp of the update

## Setup

### Automatic Setup (Vercel)

The `vercel.json` file is already configured with the cron job schedule:
- **Schedule:** Every 6 hours (`0 */6 * * *`)
- **Endpoint:** `/api/cron/market-update`

When you deploy to Vercel, the cron job will be automatically set up.

### Manual Setup (if needed)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Cron Jobs**
3. Add a new cron job:
   - **Path:** `/api/cron/market-update`
   - **Schedule:** `0 */6 * * *` (every 6 hours at minute 0)
   - **Timezone:** UTC (default)

### Schedule Format

The cron schedule `0 */6 * * *` means:
- `0` - At minute 0
- `*/6` - Every 6 hours
- `*` - Every day of month
- `*` - Every month
- `*` - Every day of week

This will run at: 00:00, 06:00, 12:00, 18:00 UTC

### Optional: Add Security

To secure your cron endpoint, you can add a `CRON_SECRET` environment variable:

1. Generate a random secret (e.g., `openssl rand -hex 32`)
2. Add to Vercel environment variables:
   - **Name:** `CRON_SECRET`
   - **Value:** Your generated secret
3. Vercel will automatically add this as an `Authorization: Bearer <secret>` header

## Testing

### Test Locally

You can test the endpoint manually:

```bash
# Test the endpoint
curl http://localhost:3000/api/cron/market-update
```

### Test on Vercel

1. Deploy your application
2. Visit: `https://your-domain.vercel.app/api/cron/market-update`
3. Check your Telegram channel for the market update

### Manual Trigger

You can also trigger it manually by visiting the endpoint URL in your browser or using curl.

## Data Source

- **API:** CoinGecko (free tier)
- **Update Frequency:** Every 6 hours
- **Data Cached:** 5 minutes (to avoid rate limits)

## Features

✅ Top 20 cryptocurrencies with prices  
✅ 24-hour price changes with emojis  
✅ Global market data  
✅ Market sentiment analysis  
✅ Formatted with emojis for better readability  
✅ Automatic posting every 6 hours  

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
- **Update frequency:** Change the schedule in `vercel.json`
- **Number of cryptos:** Edit `fetchTopCryptos(20)` in the cron route
- **Message format:** Edit `formatCryptoPricesMessage()` in `src/lib/crypto-prices.ts`

