# Cross-App Linking Guide

Quick reference for linking between apps in your monorepo.

## Environment Variables Setup

### Main App (DesignFi Studio)
```env
# .env.local or Vercel Environment Variables
NEXT_PUBLIC_SECOND_APP_URL=https://your-second-app.vercel.app
NEXT_PUBLIC_SECOND_APP_NAME=Second App Name
```

### Second App
```env
# .env.local or Vercel Environment Variables
NEXT_PUBLIC_MAIN_APP_URL=https://designfi.studio
NEXT_PUBLIC_MAIN_APP_NAME=DesignFi Studio
```

## Component Examples

### Navigation Link Component

```tsx
// shared/components/AppLink.tsx
'use client';

import Link from 'next/link';

interface AppLinkProps {
  href: string;
  label: string;
  external?: boolean;
}

export function AppLink({ href, label, external = false }: AppLinkProps) {
  if (external) {
    return (
      <Link 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="hover:underline"
      >
        {label}
      </Link>
    );
  }
  
  return (
    <Link href={href} className="hover:underline">
      {label}
    </Link>
  );
}
```

### Header with Cross-App Link

```tsx
// In your header component
import { AppLink } from '@/components/AppLink';

export function SiteHeader() {
  const secondAppUrl = process.env.NEXT_PUBLIC_SECOND_APP_URL;
  const secondAppName = process.env.NEXT_PUBLIC_SECOND_APP_NAME || 'Second App';
  
  return (
    <header>
      <nav>
        {/* Your existing links */}
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        
        {/* Cross-app link */}
        {secondAppUrl && (
          <AppLink 
            href={secondAppUrl} 
            label={secondAppName}
            external={true}
          />
        )}
      </nav>
    </header>
  );
}
```

### Footer with Cross-App Link

```tsx
// In your footer component
export function SiteFooter() {
  const secondAppUrl = process.env.NEXT_PUBLIC_SECOND_APP_URL;
  const secondAppName = process.env.NEXT_PUBLIC_SECOND_APP_NAME || 'Second App';
  
  return (
    <footer>
      <div>
        <p>© 2024 DesignFi Studio</p>
        {secondAppUrl && (
          <a 
            href={secondAppUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm hover:underline"
          >
            Visit {secondAppName}
          </a>
        )}
      </div>
    </footer>
  );
}
```

## Shared Utilities

If you want to share code between apps, create a `shared/` directory:

```
designfi/
├── shared/
│   ├── components/
│   │   └── AppLink.tsx
│   ├── lib/
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── apps/
│   ├── main-app/
│   └── second-app/
```

Then in each app's `package.json`, you can reference shared code:

```json
{
  "dependencies": {
    "@shared/components": "file:../../shared/components",
    "@shared/lib": "file:../../shared/lib"
  }
}
```

## SEO Considerations

When linking between apps, use proper attributes:

```tsx
<a 
  href={otherAppUrl}
  target="_blank"
  rel="noopener noreferrer nofollow"
>
  Other App
</a>
```

- `target="_blank"` - Opens in new tab
- `rel="noopener noreferrer"` - Security best practice
- `rel="nofollow"` - Optional, tells search engines not to follow (if you don't want SEO benefit)

## Testing Cross-Links

1. **Local Testing:**
   - Run both apps locally on different ports
   - Update env vars to point to localhost URLs
   - Test the links

2. **Production Testing:**
   - Deploy both apps
   - Set environment variables in Vercel
   - Test links in production

## Example: Full Cross-Link Implementation

```tsx
// apps/main-app/src/components/cross-app-nav.tsx
'use client';

import Link from 'next/link';

const CROSS_APP_LINKS = [
  {
    url: process.env.NEXT_PUBLIC_SECOND_APP_URL,
    name: process.env.NEXT_PUBLIC_SECOND_APP_NAME || 'Second App',
    enabled: !!process.env.NEXT_PUBLIC_SECOND_APP_URL,
  },
  // Add more apps as needed
].filter(link => link.enabled);

export function CrossAppNav() {
  if (CROSS_APP_LINKS.length === 0) return null;
  
  return (
    <nav className="flex gap-4">
      {CROSS_APP_LINKS.map((link) => (
        <Link
          key={link.url}
          href={link.url!}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm hover:underline"
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}
```

Then use it in your header or footer:

```tsx
import { CrossAppNav } from '@/components/cross-app-nav';

export function SiteHeader() {
  return (
    <header>
      {/* Your existing nav */}
      <CrossAppNav />
    </header>
  );
}
```




