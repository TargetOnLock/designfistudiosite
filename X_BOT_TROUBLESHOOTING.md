# X Bot Troubleshooting Guide

## 403 Forbidden Error

If you're getting a `403 Forbidden` error, it usually means one of these issues:

### 1. App Permissions Not Set to Read and Write

**Fix:**
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Select your app
3. Go to **Settings** → **User authentication settings**
4. Under **App permissions**, make sure it's set to **Read and Write** (not just Read)
5. Save changes
6. **Regenerate your Access Token and Access Token Secret** (important!)
7. Update your environment variables with the new tokens

### 2. App Needs Elevated Access

Twitter API v2 requires **Elevated** access to post tweets.

**Fix:**
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Select your app
3. Check your **App info** → **Access level**
4. If it says "Essential" or "Basic", you need to upgrade:
   - Click **Upgrade** or **Apply for Elevated access**
   - Fill out the application form
   - Wait for approval (usually instant for most use cases)
5. Once approved, regenerate your Access Token and Access Token Secret
6. Update your environment variables

### 3. Access Tokens Are Invalid or Expired

**Fix:**
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Select your app
3. Go to **Keys and Tokens** tab
4. Under **Access Token and Secret**, click **Regenerate**
5. Copy the new **Access Token** and **Access Token Secret**
6. Update your environment variables in Vercel
7. **Redeploy** your application

### 4. Wrong API Credentials

**Fix:**
1. Double-check all 5 environment variables are set correctly:
   - `TWITTER_API_KEY`
   - `TWITTER_API_SECRET`
   - `TWITTER_ACCESS_TOKEN`
   - `TWITTER_ACCESS_TOKEN_SECRET`
   - `TWITTER_BEARER_TOKEN`
2. Make sure there are no extra spaces or quotes
3. Verify they match exactly what's in the Twitter Developer Portal

## 401 Unauthorized Error

This means your API credentials are incorrect.

**Fix:**
1. Verify all credentials in [Twitter Developer Portal](https://developer.twitter.com/)
2. Make sure you're using the correct keys/tokens for your app
3. Check for typos in environment variables
4. Ensure no extra spaces or quotes around values

## Common Issues

### "Twitter API credentials not configured"
- Make sure all 5 Twitter environment variables are set in Vercel
- Check that variable names match exactly (case-sensitive)
- Redeploy after adding environment variables

### Tweets not posting but no error
- Check Vercel function logs for detailed error messages
- Verify your Twitter account is active and not suspended
- Check Twitter API status page for outages

### Rate Limit Errors
- The bot posts with 30-second delays to avoid rate limits
- If you still hit limits, you may be posting too frequently
- Free tier allows 1,500 tweets per month

## Step-by-Step Fix for 403 Error

1. **Go to Twitter Developer Portal**: https://developer.twitter.com/
2. **Select your app**
3. **Check App Permissions**:
   - Settings → User authentication settings
   - Set to **Read and Write**
   - Save
4. **Check Access Level**:
   - App info → Access level
   - Should be **Elevated** (not Essential/Basic)
   - If not, apply for Elevated access
5. **Regenerate Tokens**:
   - Keys and Tokens tab
   - Regenerate Access Token and Secret
   - Copy new values
6. **Update Vercel Environment Variables**:
   - Go to Vercel → Your Project → Settings → Environment Variables
   - Update `TWITTER_ACCESS_TOKEN` and `TWITTER_ACCESS_TOKEN_SECRET`
   - Make sure all 5 variables are set
7. **Redeploy**:
   - Go to Deployments tab
   - Click three dots (⋯) → Redeploy
8. **Test again**:
   - Visit: `https://your-domain.vercel.app/api/cron/x-bot`

## Still Having Issues?

- Check Vercel function logs for detailed error messages
- Verify your Twitter account is in good standing
- Make sure you're using Twitter API v2 (not v1.1)
- Contact Twitter Developer Support if access level issues persist

