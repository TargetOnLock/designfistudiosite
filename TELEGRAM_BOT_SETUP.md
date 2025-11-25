# Telegram Bot Setup Guide

This guide will help you set up a Telegram bot to automatically post new articles to your Telegram channel.

## Step 1: Create a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Start a chat with BotFather and send `/newbot`
3. Follow the instructions to:
   - Choose a name for your bot (e.g., "DesignFi Articles Bot")
   - Choose a username for your bot (must end in "bot", e.g., "designfi_articles_bot")
4. BotFather will give you a **Bot Token** (looks like `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
5. **Save this token** - you'll need it for the environment variable

## Step 2: Create or Get Your Telegram Channel

### Option A: Use an Existing Channel
1. Open your Telegram channel
2. Make sure the bot is added as an administrator to the channel
3. Get your channel username (e.g., `@designfi_articles`) or channel ID

### Option B: Create a New Channel
1. In Telegram, tap the menu (☰) → "New Channel"
2. Choose a name and description
3. Make it **Public** (recommended) or Private
4. If public, choose a username (e.g., `@designfi_articles`)
5. Add your bot as an administrator:
   - Go to channel settings → Administrators → Add Administrator
   - Select your bot and give it permission to post messages

## Step 3: Get Your Channel ID

### For Public Channels:
- Your channel ID is the username with `@` (e.g., `@designfi_articles`)

### For Private Channels:
1. Forward a message from your channel to [@userinfobot](https://t.me/userinfobot)
2. The bot will reply with your channel ID (looks like `-1001234567890`)
3. **Note:** Private channel IDs start with `-100`

## Step 4: Add Environment Variables to Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

   **Variable Name:** `TELEGRAM_BOT_TOKEN`  
   **Value:** Your bot token from Step 1  
   **Environment:** Production, Preview, Development (select all)

   **Variable Name:** `TELEGRAM_CHANNEL_ID`  
   **Value:** Your channel ID or username (e.g., `@designfi_articles` or `-1001234567890`)  
   **Environment:** Production, Preview, Development (select all)

4. Click **Save** for each variable

## Step 5: Redeploy Your Application

After adding the environment variables:
1. Go to the **Deployments** tab in Vercel
2. Click the three dots (⋯) on your latest deployment
3. Select **Redeploy**
4. Or push a new commit to trigger a new deployment

## Step 6: Test the Integration

1. Publish a new article on your website
2. Check your Telegram channel - the article should appear automatically!
3. The message will include:
   - Article title
   - Content preview
   - Author information
   - Link to read the full article
   - Social media links (for self-published articles)
   - Image (if available as URL)

## Troubleshooting

### Bot Not Posting Messages
- **Check bot permissions:** Make sure the bot is an administrator in the channel
- **Check channel ID:** Verify the channel ID is correct (include `@` for public channels or `-100` prefix for private)
- **Check logs:** Check Vercel function logs for any error messages
- **Test manually:** You can test the bot by sending a message to it directly

### Images Not Showing
- External article images (URLs) will display in Telegram
- Base64 images (self-published) will show as text-only with a link to the website
- This is a limitation of Telegram's API - images must be accessible via URL

### Bot Token Issues
- Make sure there are no extra spaces in the token
- The token should look like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
- If you lose your token, create a new bot with BotFather

## Features

✅ **Automatic posting** - Every new self-published article is automatically posted to Telegram  
✅ **Rich formatting** - Includes title, preview, author, and links  
✅ **Social links** - Shows Telegram, X (Twitter), and website links for authors  
✅ **Image support** - Displays images from external articles  
✅ **Non-blocking** - Telegram posting won't delay article publishing if it fails  

## Next Steps

- The bot currently only posts self-published articles
- External articles from RSS feeds are not automatically posted (they're fetched dynamically)
- If you want to post external articles, we can set up a scheduled job to check for new external articles

