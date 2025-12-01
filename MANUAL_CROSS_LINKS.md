# Manual Cross-Links Between Apps

Quick reference for adding links between your apps.

## Simple Link Examples

### In Your Main App (DesignFi Studio)

Add to header or footer:

```tsx
// In src/components/site-header.tsx or site-footer.tsx
<Link 
  href="https://your-second-app.vercel.app"
  target="_blank"
  rel="noopener noreferrer"
  className="hover:underline"
>
  Second App Name
</Link>
```

### In Your Second App

Add back to main app:

```tsx
// In your second app's header/footer
<Link 
  href="https://designfi.studio"
  target="_blank"
  rel="noopener noreferrer"
  className="hover:underline"
>
  DesignFi Studio
</Link>
```

## Best Practices

- Use `target="_blank"` to open in new tab
- Use `rel="noopener noreferrer"` for security
- Style consistently with your existing links
- Add to both header and footer for visibility

That's it! Simple and straightforward. 🚀




