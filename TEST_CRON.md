# Testing the Market Update Cron Job

## Quick Test

To test if the market update is working, you can manually trigger it:

### Option 1: Visit the URL in Browser

1. Deploy your app to Vercel
2. Visit: `https://your-domain.vercel.app/api/cron/market-update`
3. You should see a JSON response with `success: true` or an error message
4. Check your Telegram channel for the market update

### Option 2: Use curl

```bash
curl https://your-domain.vercel.app/api/cron/market-update
```

### Option 3: Test Locally

1. Make sure you have `.env.local` with:
   ```
   TELEGRAM_BOT_TOKEN=your_token_here
   TELEGRAM_CHANNEL_ID=@DesignFiStudio
   ```

2. Run your dev server:
   ```bash
   npm run dev
   ```

3. Visit: `http://localhost:3000/api/cron/market-update`

## Expected Response

### Success Response:
```json
{
  "success": true,
  "messageId": 12345,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "duration": "2345ms"
}
```

### Error Response:
```json
{
  "success": false,
  "error": "Error message here",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "duration": "1234ms"
}
```

## Check Vercel Logs

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Deployments**
4. Click on your latest deployment
5. Click **Functions** tab
6. Find `/api/cron/market-update`
7. Click to view logs

You should see detailed logs like:
```
==================================================
Market Update Cron Job Started
Timestamp: 2024-01-01T12:00:00.000Z
==================================================
Environment check:
- TELEGRAM_BOT_TOKEN: ✓ Set
- TELEGRAM_CHANNEL_ID: ✓ Set
Starting market update fetch...
Channel ID: @DesignFiStudio
Fetching crypto data from CoinGecko...
Fetched 20 cryptocurrencies
Market data: Success
Message length: 2345 characters
Sending message to Telegram...
Market update sent successfully! Message ID: 12345
==================================================
Market Update Cron Job Completed
Duration: 2345ms
Success: true
==================================================
```

## Common Issues

### Issue: "Telegram bot not configured"
**Solution:** Make sure `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHANNEL_ID` are set in Vercel environment variables.

### Issue: "Unauthorized" or "Forbidden"
**Solution:** 
- Check that the bot is an administrator in the channel
- Verify the channel ID is correct (include `@` for public channels)

### Issue: CoinGecko API errors
**Solution:**
- CoinGecko free tier has rate limits
- Wait a few minutes and try again
- The error will be logged in Vercel function logs

### Issue: Message too long
**Solution:**
- The code automatically truncates messages over 4000 characters
- This should rarely happen, but if it does, the message will still be sent (truncated)

## Verify Cron Job is Scheduled

1. Go to Vercel Dashboard → Your Project → **Settings** → **Cron Jobs**
2. You should see:
   - **Path:** `/api/cron/market-update`
   - **Schedule:** `0 */6 * * *`
   - **Status:** Active/Enabled

If it's not there, the `vercel.json` file should create it automatically on the next deployment.

