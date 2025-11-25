# Deploy Market Update Cron Job

## The Issue
The `/api/cron/market-update` endpoint returns 404 because the new files haven't been deployed to Vercel yet.

## Solution: Deploy to Vercel

### Option 1: Redeploy via Vercel Dashboard (Easiest)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to the **Deployments** tab
4. Find your latest deployment
5. Click the **three dots (⋯)** menu
6. Select **Redeploy**
7. Wait for deployment to complete
8. Test the endpoint: `https://your-domain.vercel.app/api/cron/market-update`

### Option 2: Push to Git (If Connected)

If your project is connected to GitHub/GitLab:

1. **Commit the changes:**
   ```bash
   git add .
   git commit -m "Add market update cron job endpoint"
   git push
   ```

2. Vercel will automatically deploy when you push
3. Wait for deployment to complete
4. Test the endpoint: `https://your-domain.vercel.app/api/cron/market-update`

### Option 3: Deploy via Vercel CLI

If you have Vercel CLI installed:

```bash
vercel --prod
```

## After Deployment

1. **Test the endpoint:**
   - Visit: `https://your-domain.vercel.app/api/cron/market-update`
   - You should see a JSON response (not 404)

2. **Check Vercel Cron Jobs:**
   - Go to **Settings** → **Cron Jobs**
   - Verify the cron job is listed:
     - Path: `/api/cron/market-update`
     - Schedule: `0 */6 * * *`

3. **Check your Telegram channel:**
   - The market update should post automatically every 6 hours
   - Or test immediately by visiting the endpoint URL

## Files That Need to Be Deployed

- ✅ `src/app/api/cron/market-update/route.ts` (new)
- ✅ `src/lib/crypto-prices.ts` (new)
- ✅ `src/lib/telegram-bot.ts` (updated)
- ✅ `vercel.json` (updated)

## Troubleshooting

### Still Getting 404?

1. **Wait a few minutes** - Deployment can take 1-2 minutes
2. **Check deployment status** in Vercel dashboard
3. **Verify the route path** is correct: `/api/cron/market-update`
4. **Check build logs** for any errors

### Build Errors?

Check the deployment logs in Vercel for any TypeScript or build errors.

