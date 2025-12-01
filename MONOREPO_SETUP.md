# Monorepo Setup Guide - Multiple Apps with Cross-Links

This guide shows you how to add another app to your repository and create backlinks between them.

## Option 1: Simple Monorepo Structure (Recommended)

Create separate apps in the same repository:

```
designfi/
├── apps/
│   ├── main-app/          # Your current DesignFi Studio app
│   │   ├── src/
│   │   ├── package.json
│   │   └── next.config.ts
│   └── second-app/        # Your new app
│       ├── src/
│       ├── package.json
│       └── next.config.ts
├── package.json           # Root package.json (workspace config)
└── vercel.json            # Vercel config for multiple apps
```

## Step 1: Restructure Your Current App

1. **Create the apps directory:**
   ```bash
   mkdir apps
   mkdir apps/main-app
   ```

2. **Move your current app:**
   - Move all files from root to `apps/main-app/`
   - Keep `package.json`, `tsconfig.json`, etc. in `apps/main-app/`

## Step 2: Create Your Second App

1. **Create the second app directory:**
   ```bash
   mkdir apps/second-app
   cd apps/second-app
   npx create-next-app@latest . --typescript --tailwind --app
   ```

2. **Or manually create it:**
   - Copy the structure from `main-app`
   - Modify `package.json` with a different name
   - Update `next.config.ts` if needed

## Step 3: Set Up Root Package.json (Workspace)

Create a root `package.json` at the repository root:

```json
{
  "name": "designfi-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*"
  ],
  "scripts": {
    "dev:main": "npm run dev --workspace=apps/main-app",
    "dev:second": "npm run dev --workspace=apps/second-app",
    "dev:all": "npm run dev:main & npm run dev:second",
    "build:main": "npm run build --workspace=apps/main-app",
    "build:second": "npm run build --workspace=apps/second-app"
  }
}
```

## Step 4: Update Vercel Configuration

Update `vercel.json` to handle multiple apps:

```json
{
  "buildCommand": "cd apps/main-app && npm run build",
  "outputDirectory": "apps/main-app/.next",
  "installCommand": "npm install",
  "framework": "nextjs",
  "crons": [
    {
      "path": "/api/cron/market-update",
      "schedule": "0 12 * * *"
    }
  ]
}
```

For multiple apps, you'll need separate Vercel projects or use Vercel's monorepo support.

## Step 5: Create Cross-Links Between Apps

### Method 1: Simple URL Links (Easiest)

In your main app, add links to the second app:

```tsx
// In apps/main-app/src/components/site-header.tsx
<Link href="https://second-app.vercel.app">Second App</Link>
```

In your second app, add links back:

```tsx
// In apps/second-app/src/components/header.tsx
<Link href="https://designfi.studio">DesignFi Studio</Link>
```

### Method 2: Shared Navigation Component

Create a shared component that both apps can use:

```tsx
// shared/components/CrossAppNav.tsx
export function CrossAppNav() {
  return (
    <nav>
      <a href="https://designfi.studio">Main App</a>
      <a href="https://second-app.vercel.app">Second App</a>
    </nav>
  );
}
```

### Method 3: Environment Variables for URLs

Set environment variables for app URLs:

```env
# In apps/main-app/.env.local
NEXT_PUBLIC_SECOND_APP_URL=https://second-app.vercel.app

# In apps/second-app/.env.local
NEXT_PUBLIC_MAIN_APP_URL=https://designfi.studio
```

Then use them in components:

```tsx
// In apps/main-app/src/components/site-header.tsx
const secondAppUrl = process.env.NEXT_PUBLIC_SECOND_APP_URL || 'https://second-app.vercel.app';

<Link href={secondAppUrl}>Second App</Link>
```

## Step 6: Deploy Both Apps to Vercel

### Option A: Separate Vercel Projects (Recommended)

1. **Main App:**
   - Connect `apps/main-app` to one Vercel project
   - Domain: `designfi.studio`

2. **Second App:**
   - Connect `apps/second-app` to another Vercel project
   - Domain: `second-app.vercel.app` or custom domain

### Option B: Single Vercel Project with Monorepo

1. In Vercel Dashboard → Settings → General
2. Set **Root Directory** to `apps/main-app` for the main app
3. Create a second Vercel project pointing to `apps/second-app`

## Step 7: Add Backlinks in Components

### Example: Add to Main App Header

```tsx
// apps/main-app/src/components/site-header.tsx
import Link from 'next/link';

export function SiteHeader() {
  const secondAppUrl = process.env.NEXT_PUBLIC_SECOND_APP_URL;
  
  return (
    <header>
      {/* Existing navigation */}
      <nav>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        {/* ... other links ... */}
        {secondAppUrl && (
          <Link href={secondAppUrl} target="_blank" rel="noopener noreferrer">
            Second App
          </Link>
        )}
      </nav>
    </header>
  );
}
```

### Example: Add to Second App

```tsx
// apps/second-app/src/components/header.tsx
import Link from 'next/link';

export function Header() {
  const mainAppUrl = process.env.NEXT_PUBLIC_MAIN_APP_URL;
  
  return (
    <header>
      <nav>
        <Link href="/">Home</Link>
        {mainAppUrl && (
          <Link href={mainAppUrl} target="_blank" rel="noopener noreferrer">
            DesignFi Studio
          </Link>
        )}
      </nav>
    </header>
  );
}
```

## Option 2: Simpler Approach - Subdirectory Apps

If you don't want to restructure everything, you can keep your current app as-is and add a second app in a subdirectory:

```
designfi/
├── src/                    # Your current app (stays as-is)
├── apps/
│   └── second-app/         # New app
├── package.json            # Current package.json
└── vercel.json
```

Then deploy them as separate Vercel projects pointing to different root directories.

## Benefits of Monorepo

✅ **Shared code:** Share utilities, types, components between apps  
✅ **Single repository:** Easier to manage and version control  
✅ **Consistent tooling:** Same linting, formatting, etc.  
✅ **Cross-linking:** Easy to link between apps  

## Quick Start Commands

```bash
# Install dependencies for all apps
npm install

# Run main app
npm run dev:main

# Run second app
npm run dev:second

# Run both (if configured)
npm run dev:all
```

## Next Steps

1. Decide on the structure (Option 1 or 2)
2. Restructure if needed
3. Create the second app
4. Add cross-links
5. Deploy both to Vercel
6. Test the links

Would you like me to help you set up a specific structure or create the second app?




