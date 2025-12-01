# X (Twitter) Bot Setup Guide

This guide will help you set up the X/Twitter bot to automatically post marketing content 4 times per day.

## Features

- 🤖 **AI-Generated Content**: Uses OpenAI to create engaging marketing posts
- 📝 **4 Posts Per Day**: Posts marketing facts, tips, jokes, and insights
- 🎨 **Comical & Engaging**: Content is designed to be entertaining and shareable
- 🔄 **Automatic**: Runs via Vercel cron job once per day (posts all 4 tweets with delays)

## Step 1: Get Twitter/X API Credentials

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Sign in with your X/Twitter account
3. Create a new project or use an existing one
4. Create a new app within your project
5. Navigate to **Keys and Tokens** tab
6. You'll need:
   - **API Key** (Consumer Key)
   - **API Secret** (Consumer Secret)
   - **Access Token**
   - **Access Token Secret**
   - **Bearer Token** (generate if not available)

### Important Notes:
- Make sure your app has **Read and Write** permissions
- Keep all tokens secure - never commit them to git
- The account you use must be the one you want to post from

## Step 2: Get OpenAI API Key (Optional but Recommended)

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to **API Keys** section
4. Create a new API key
5. Copy the key (starts with `sk-...`)

**Note:** If you don't set up OpenAI, the bot will use fallback content (pre-written posts). It will still work, but AI-generated content is more varied and engaging.

## Step 3: Add Environment Variables

### For Local Development:

Create or edit `.env.local` in your project root:

```env
# Twitter/X API Credentials
TWITTER_API_KEY=your_api_key_here
TWITTER_API_SECRET=your_api_secret_here
TWITTER_ACCESS_TOKEN=your_access_token_here
TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret_here
TWITTER_BEARER_TOKEN=your_bearer_token_here

# OpenAI API Key (Optional - for AI-generated content)
OPENAI_API_KEY=sk-your_openai_api_key_here
```

### For Vercel (Production):

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

   **Twitter/X Variables:**
   - `TWITTER_API_KEY` - Your Twitter API Key
   - `TWITTER_API_SECRET` - Your Twitter API Secret
   - `TWITTER_ACCESS_TOKEN` - Your Access Token
   - `TWITTER_ACCESS_TOKEN_SECRET` - Your Access Token Secret
   - `TWITTER_BEARER_TOKEN` - Your Bearer Token

   **OpenAI Variable (Optional):**
   - `OPENAI_API_KEY` - Your OpenAI API Key (starts with `sk-`)

4. Select all environments (Production, Preview, Development)
5. Click **Save** for each variable

## Step 4: Configure Cron Schedule

The bot is configured to run once per day at **9:00 AM UTC** and post all 4 tweets with 30-second delays between them.

To change the schedule, edit `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/x-bot",
      "schedule": "0 9 * * *"  // Change this to your preferred time
    }
  ]
}
```

**Cron Schedule Format:** `minute hour day month weekday`
- `0 9 * * *` = 9:00 AM UTC daily
- `0 12 * * *` = 12:00 PM UTC daily
- `0 */6 * * *` = Every 6 hours (requires Vercel Pro)

**Note:** Vercel Hobby plan only allows **one cron job per day**. The bot posts all 4 tweets in a single execution with delays. If you want to post at different times throughout the day, you'll need to upgrade to Vercel Pro.

## Step 5: Redeploy Your Application

After adding environment variables:

1. Go to the **Deployments** tab in Vercel
2. Click the three dots (⋯) on your latest deployment
3. Select **Redeploy**
4. Or push a new commit to trigger a new deployment

## Step 6: Test the Bot

### Manual Test:

Visit this URL in your browser (replace with your domain):
```
https://your-domain.vercel.app/api/cron/x-bot
```

You should see a JSON response indicating success or failure.

### Check Your X/Twitter Account:

After the cron job runs, check your X/Twitter account to see the posted tweets.

## How It Works

1. **Cron Job Triggers**: Vercel cron job runs once per day
2. **Content Generation**: AI generates 4 different types of marketing posts:
   - Marketing facts
   - Marketing tips
   - Marketing jokes
   - Random marketing insights
3. **Posting**: Posts all 4 tweets with 30-second delays between each (to avoid rate limits)
4. **Variety**: Content is shuffled each day for variety

## Content Types

- **Facts**: Fun, engaging marketing facts about digital marketing, Web3, crypto, or branding
- **Tips**: Practical, actionable marketing tips with humor
- **Jokes**: Lighthearted marketing jokes and puns
- **Random**: Mix of insights, facts, tips, and engaging content

All content is:
- Under 280 characters (X/Twitter limit)
- Includes emojis
- Relevant to DesignFi Studio's services
- Comical and entertaining

## Troubleshooting

### "X/Twitter bot not configured"
- Make sure all 5 Twitter environment variables are set
- Check that variable names match exactly (case-sensitive)
- Redeploy after adding environment variables

### "OpenAI API key not configured"
- This is optional - the bot will use fallback content
- If you want AI-generated content, add `OPENAI_API_KEY` to environment variables

### Tweets not posting
- Check Twitter API credentials are correct
- Verify your app has Read and Write permissions
- Check Twitter API rate limits (you shouldn't hit them with 4 posts/day)
- Check Vercel function logs for detailed error messages

### Rate Limit Errors
- The bot posts with 30-second delays to avoid rate limits
- If you still hit limits, increase the delay in `src/lib/x-bot.ts` (default: 30000ms)

### Cron Job Not Running
- Verify the cron schedule in `vercel.json`
- Check Vercel cron job logs in the dashboard
- Make sure you're on a Vercel plan that supports cron jobs

## Cost Considerations

- **Twitter API**: Free tier allows 1,500 tweets per month (plenty for 4/day = ~120/month)
- **OpenAI API**: ~$0.15 per 1M tokens. With GPT-4o-mini, 4 posts/day costs roughly $0.01-0.02 per day
- **Vercel**: Included in your plan (Hobby plan supports cron jobs)

## Security Notes

- ✅ Never commit API keys to git
- ✅ Use environment variables for all secrets
- ✅ `.env.local` is in `.gitignore` - safe to create locally
- ✅ Use Vercel environment variables for production
- ❌ Never put tokens in code files
- ❌ Never share your API keys publicly

## Next Steps

1. Set up your Twitter API credentials
2. (Optional) Set up OpenAI for AI-generated content
3. Add environment variables to Vercel
4. Redeploy your application
5. Test the bot manually
6. Wait for the cron job to run automatically

Your X/Twitter bot is now ready to automatically post engaging marketing content! 🚀

