# Test X Bot

Quick guide to test your X/Twitter bot.

## Manual Test

Visit this URL (replace with your domain):
```
https://your-domain.vercel.app/api/cron/x-bot
```

## Expected Response

**Success:**
```json
{
  "success": true,
  "message": "Posted 4 tweets successfully",
  "tweetsPosted": 4,
  "tweetIds": ["1234567890", "1234567891", "1234567892", "1234567893"],
  "timestamp": "2025-01-25T12:00:00.000Z",
  "duration": "125000ms"
}
```

**Error (Not Configured):**
```json
{
  "success": false,
  "error": "X/Twitter bot not configured - missing Twitter API credentials",
  "timestamp": "2025-01-25T12:00:00.000Z"
}
```

## What Happens

1. Bot generates 4 marketing posts (using AI or fallback content)
2. Posts each tweet with 30-second delays between them
3. Returns results with tweet IDs

## Check Your X/Twitter Account

After testing, check your X/Twitter account to see the posted tweets!

## Troubleshooting

- **404 Error**: Make sure you've deployed the latest code to Vercel
- **500 Error**: Check that all Twitter API credentials are set in environment variables
- **No tweets posted**: Check Vercel function logs for detailed error messages

