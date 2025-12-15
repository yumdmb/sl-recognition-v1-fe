# Email Service Setup

This application uses email notifications for password changes. Here's how to set it up:

## Setup Instructions

### 1. Create a Resend Account

1. Go to [Resend.com](https://resend.com) and create a free account
2. Verify your email address
3. Navigate to API Keys section

### 2. Get Your API Key

1. Click "Create API Key"
2. Give it a name (e.g., "SL Recognition App")
3. Copy the API key (you'll only see it once!)

### 3. Configure Environment Variables

1. Create a `.env.local` file in the root directory (if it doesn't exist)
2. Add the following variables:

```env
# Email Service Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=noreply@yourdomain.com
```

**Important:** Replace `noreply@yourdomain.com` with:
- **Development:** You can use `onboarding@resend.dev` (Resend's test email)
- **Production:** Use your verified domain email

### 4. Verify Domain (Production Only)

For production use, you need to verify your domain:

1. Go to Resend Dashboard → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the DNS records provided by Resend to your domain registrar
5. Wait for verification (usually a few minutes)

### 5. Test the Email Service

1. Start your development server: `npm run dev`
2. Go to Profile page
3. Click "Change Password"
4. Enter a new password
5. Check your email inbox

## Email Features

When a user changes their password:
- ✅ Receives an email with the new password
- ✅ Professional HTML email template
- ✅ Security warnings included
- ✅ Works in development and production

## Troubleshooting

### Email not sending?

1. **Check API Key**: Make sure `RESEND_API_KEY` is set correctly in `.env.local`
2. **Check FROM_EMAIL**: 
   - Development: Use `onboarding@resend.dev`
   - Production: Use your verified domain email
3. **Check Console**: Look for error messages in the terminal
4. **Check Resend Dashboard**: View email logs at https://resend.com/emails

### Testing in Development

Use Resend's test email for development:
```env
FROM_EMAIL=onboarding@resend.dev
```

This allows you to send test emails without domain verification.

## API Endpoint

The email service uses the following API endpoint:

```
POST /api/send-email
```

**Request Body:**
```json
{
  "type": "password-change",
  "data": {
    "to": "user@example.com",
    "userName": "John Doe",
    "newPassword": "newPassword123"
  }
}
```

## Email Template

The password change email includes:
- Header with branding
- User's name
- New password in a highlighted box
- Security warnings
- Contact information
- Professional footer

## Free Tier Limits

Resend free tier includes:
- **100 emails/day**
- **3,000 emails/month**
- Full API access
- Email logs

For production apps with more users, consider upgrading to a paid plan.

## Alternative Email Services

If you prefer other email services, you can modify `/src/app/api/send-email/route.ts` to use:
- SendGrid
- AWS SES
- Mailgun
- NodeMailer (SMTP)

## Security Notes

⚠️ **Important:** Sending passwords via email is not recommended in production. Consider:
- Sending a password reset link instead
- Using temporary passwords that expire
- Implementing 2FA for password changes
- Not storing passwords in plain text

This feature is implemented as requested but should be enhanced for production use.
