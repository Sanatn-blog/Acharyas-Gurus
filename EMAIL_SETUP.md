# Email Verification Setup Guide

This guide will help you set up OTP-based email verification for the Acharyas-Gurus application.

## Environment Variables Required

Add the following environment variables to your `.env.local` file:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key

# Email Configuration (for Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

## Gmail Setup Instructions

1. **Enable 2-Step Verification**:
   - Go to your Google Account settings
   - Navigate to Security
   - Enable 2-Step Verification if not already enabled

2. **Create App Password**:
   - Go to Security > App passwords
   - Select "Mail" as the app
   - Generate a new app password
   - Use this password as `EMAIL_PASSWORD` in your environment variables

3. **Alternative Email Services**:
   - You can modify the email configuration in `lib/email.ts`
   - Supported services include: Gmail, Outlook, Yahoo, etc.
   - For production, consider using services like SendGrid, Mailgun, or AWS SES

## Features Implemented

### 1. OTP-Based Email Verification Flow
- Users receive a 6-digit OTP via email upon registration
- OTP expires after 10 minutes for security
- Users must enter the OTP on the verification page
- Maximum 5 failed attempts with 15-minute cooldown

### 2. API Endpoints
- `POST /api/auth/signup` - Creates account and sends OTP email
- `POST /api/auth/verify-email` - Verifies email using OTP
- `POST /api/auth/resend-verification` - Resends OTP email
- `GET /api/auth/verify-email` - Backward compatibility (redirects to verification page)

### 3. Pages
- `/auth/verify-email` - OTP verification page with form input
- `/auth/resend-verification` - Resend verification OTP page

### 4. User Experience
- Clean OTP input form with validation
- Real-time OTP formatting (numbers only, 6 digits max)
- Resend OTP functionality
- Clear success/error messages
- Automatic redirects after verification
- Responsive design with dark mode support

## Security Features

- 6-digit numeric OTP generation
- OTP expires after 10 minutes
- Maximum 5 failed attempts with 15-minute cooldown
- Rate limiting on OTP resend
- Email validation and sanitization
- Secure OTP storage in database
- One-time use OTP (cleared after verification)

## Testing

1. **Local Testing**:
   - Use a real email address during registration
   - Check your inbox for the OTP email
   - Enter the OTP on the verification page
   - Test resend functionality

2. **Email Delivery**:
   - Check spam folder if emails don't arrive
   - Verify your email configuration is correct
   - Test with different email providers

## Troubleshooting

### Common Issues:

1. **Emails not sending**:
   - Check your email credentials
   - Verify app password is correct
   - Check if 2-Step Verification is enabled

2. **OTP not working**:
   - Ensure OTP hasn't expired (10 minutes)
   - Check if you've exceeded attempt limit
   - Verify the OTP format (6 digits)

3. **Database errors**:
   - Ensure MongoDB connection is working
   - Check if the User model has been updated with new OTP fields

## Production Considerations

1. **Email Service**: Use a dedicated email service like SendGrid or Mailgun
2. **Rate Limiting**: Implement rate limiting for OTP sending
3. **Monitoring**: Add logging for email delivery status
4. **Backup**: Consider backup email verification methods
5. **Compliance**: Ensure GDPR/email compliance for your region
6. **OTP Security**: Consider implementing additional security measures like:
   - IP-based rate limiting
   - Device fingerprinting
   - SMS backup for critical accounts

## Migration from Token-Based Verification

If you're migrating from the previous token-based verification:

1. **Database Migration**: The User model has been updated with new OTP fields
2. **Backward Compatibility**: Old verification links will redirect to the new OTP page
3. **User Experience**: Users will need to enter their email and OTP manually
4. **Testing**: Test the new flow thoroughly before deploying to production 