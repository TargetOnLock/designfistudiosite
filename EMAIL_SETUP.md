# Email Setup Guide for Contact Form

The contact form is configured to send emails to **powersblaine23@gmail.com**.

## Setup Instructions

### Option 1: Gmail App-Specific Password (Recommended for Testing)

1. **Enable 2-Factor Authentication** on your Gmail account:
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification if not already enabled

2. **Create an App-Specific Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "DesignFi Studio Contact Form"
   - Copy the 16-character password (no spaces)

3. **Add to `.env.local`**:
   ```env
   GMAIL_USER=powersblaine23@gmail.com
   GMAIL_APP_PASSWORD=your-16-character-app-password-here
   ```

### Option 2: Custom SMTP Server

If you have a custom SMTP server (like from your hosting provider):

```env
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
SMTP_USER=your-email@yourdomain.com
SMTP_PASS=your-smtp-password
SMTP_FROM=noreply@yourdomain.com
```

## For Vercel Deployment

Add the same environment variables in your Vercel project:
1. Go to your project → **Settings** → **Environment Variables**
2. Add `GMAIL_USER` and `GMAIL_APP_PASSWORD` (or SMTP variables)
3. Select all environments (Production, Preview, Development)
4. Redeploy your project

## Testing

After setting up, test the contact form. Emails will be sent to **powersblaine23@gmail.com** with:
- Subject: "New Contact Form Submission from [Name]"
- Reply-To: The submitter's email address
- Formatted HTML email with all form details

## Troubleshooting

- **"Authentication failed"**: Make sure you're using an app-specific password, not your regular Gmail password
- **"Connection timeout"**: Check your firewall/network settings
- **Emails not arriving**: Check spam folder, verify email credentials are correct

