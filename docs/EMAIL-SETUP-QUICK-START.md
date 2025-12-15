# Quick Setup: Email Service for Password Changes

## What Was Implemented

✅ Email service that sends new password to user after password change
✅ Professional HTML email template
✅ API endpoint `/api/send-email` for sending emails
✅ Integration with Resend email service
✅ Automatic email sending after successful password change

## Files Created/Modified

### New Files:
1. `src/lib/services/emailService.ts` - Email service client
2. `src/app/api/send-email/route.ts` - API endpoint for sending emails
3. `.env.example` - Environment variables template
4. `docs/email-service-setup.md` - Full setup documentation

### Modified Files:
1. `src/context/AuthContext.tsx` - Added email sending after password change

## Setup Steps (2 minutes)

### 1. Get Resend API Key (FREE)
```
1. Go to https://resend.com
2. Sign up (free account)
3. Go to API Keys → Create API Key
4. Copy the key
```

### 2. Add Environment Variables
Create `.env.local` file in root directory:
```env
RESEND_API_KEY=re_your_key_here
FROM_EMAIL=onboarding@resend.dev
```

**Note:** Use `onboarding@resend.dev` for development (no domain verification needed)

### 3. Restart Dev Server
```bash
npm run dev
```

### 4. Test It
1. Go to Profile page
2. Click "Change Password"
3. Enter new password
4. Check your email! 📧

## Email Template Preview

The user will receive:
- ✉️ Subject: "Your Password Has Been Changed"
- 👤 Personalized with user's name
- 🔐 New password in highlighted box
- ⚠️ Security warnings
- 🎨 Professional branded template

## Production Setup

For production, verify your domain:
1. Resend Dashboard → Domains → Add Domain
2. Add DNS records to your domain
3. Update `FROM_EMAIL` to use your domain:
   ```env
   FROM_EMAIL=noreply@yourdomain.com
   ```

## Troubleshooting

**Email not sending?**
- Check `.env.local` has `RESEND_API_KEY`
- Use `onboarding@resend.dev` for FROM_EMAIL in dev
- Check browser console for errors
- Check terminal for API errors

**Still not working?**
- Verify API key at https://resend.com/api-keys
- Check email logs at https://resend.com/emails
- Make sure `.env.local` is in root directory
- Restart dev server after adding env vars

## Free Tier Limits
- 100 emails/day
- 3,000 emails/month
- Perfect for development and small apps!

---

That's it! Your password change emails are ready to send. 🚀
