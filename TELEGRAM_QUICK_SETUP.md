# Telegram Bot Quick Setup

Your Telegram bot is ready to use! Here's what you need to do:

## Your Bot Details

- **Bot Token:** `8558149677:AAGZU2vkk6ut5FmV4u54IRaVRrt83YVwvfM`
- **Channel:** `@DesignFiStudio` (https://t.me/DesignFiStudio)

## Step 1: Add Bot to Channel as Administrator

1. Open Telegram and go to your channel: [@DesignFiStudio](https://t.me/DesignFiStudio)
2. Click on the channel name at the top
3. Go to **Administrators** → **Add Administrator**
4. Search for your bot (the username you created with BotFather)
5. Add the bot and make sure it has permission to **Post Messages**

## Step 2: Add Environment Variables to Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these two variables:

   **Variable 1:**
   - **Name:** `TELEGRAM_BOT_TOKEN`
   - **Value:** `8558149677:AAGZU2vkk6ut5FmV4u54IRaVRrt83YVwvfM`
   - **Environment:** Select all (Production, Preview, Development)

   **Variable 2:**
   - **Name:** `TELEGRAM_CHANNEL_ID`
   - **Value:** `@DesignFiStudio`
   - **Environment:** Select all (Production, Preview, Development)

4. Click **Save** for each variable

## Step 3: Redeploy Your Application

After adding the environment variables:

1. Go to the **Deployments** tab in Vercel
2. Click the three dots (⋯) on your latest deployment
3. Select **Redeploy**
4. Or push a new commit to trigger a new deployment

## Step 4: Test It!

1. Publish a new article on your website
2. Check your Telegram channel [@DesignFiStudio](https://t.me/DesignFiStudio)
3. The article should appear automatically with:
   - Title
   - Content preview
   - Author information
   - Link to read the full article
   - Social media links (if provided)
   - Image (if available)

## Troubleshooting

### Bot Not Posting?
- Make sure the bot is added as an **Administrator** to the channel
- Verify the channel ID is exactly `@DesignFiStudio` (with the @ symbol)
- Check Vercel function logs for any errors

### Images Not Showing?
- External article images (URLs) will display
- Base64 images will be served via the image endpoint and should display
- If images fail, the message will still be sent as text-only

### Need Help?
Check the full setup guide in `TELEGRAM_BOT_SETUP.md` for more details.

