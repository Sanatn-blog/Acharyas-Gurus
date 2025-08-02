# Scripts

This directory contains utility scripts for the Acharyas-Gurus application.

## Available Scripts

### 1. `create-admin.mjs`
Creates an admin user in the database.

**Usage:**
```bash
npm run create:admin
```

**Features:**
- Interactive prompts for admin details
- Secure password hashing
- Email validation
- Duplicate user checking

### 2. `seed-admin.js`
Seeds the database with a default admin user.

**Usage:**
```bash
npm run seed:admin
```

**Features:**
- Creates a default admin user
- Uses environment variables for configuration
- Safe to run multiple times

### 3. `migrate-to-otp.js`
Migrates existing users from token-based to OTP-based email verification.

**Usage:**
```bash
npm run migrate:otp
```

**Features:**
- Clears old verification tokens
- Sets up new OTP fields
- Safe migration process
- Detailed logging

**Important Notes:**
- Run this script after updating the User model
- Users with unverified emails will need to request new OTP
- Backup your database before running migration

## Environment Variables Required

Make sure your `.env.local` file contains:

```env
MONGODB_URI=your_mongodb_connection_string
```

## Running Scripts

1. **Development:**
   ```bash
   npm run dev
   ```

2. **Create Admin:**
   ```bash
   npm run create:admin
   ```

3. **Seed Admin:**
   ```bash
   npm run seed:admin
   ```

4. **Migrate to OTP:**
   ```bash
   npm run migrate:otp
   ```

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error:**
   - Verify `MONGODB_URI` is correct
   - Check if MongoDB is running
   - Ensure network connectivity

2. **Email Configuration:**
   - Verify email credentials in `.env.local`
   - Check Gmail app password setup
   - Test email sending manually

3. **Migration Issues:**
   - Backup database before migration
   - Check MongoDB permissions
   - Verify User model schema

## Security Notes

- Never commit `.env.local` files
- Use strong passwords for admin accounts
- Regularly rotate email app passwords
- Monitor database access logs