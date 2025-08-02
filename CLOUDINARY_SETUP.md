# Cloudinary Setup Guide

This guide will help you set up Cloudinary for image uploads with cropping functionality in the Acharyas-Gurus application.

## Prerequisites

1. A Cloudinary account (free tier available)
2. Node.js and npm installed
3. Access to your project's environment variables

## Step 1: Create a Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/) and sign up for a free account
2. Verify your email address
3. Log in to your Cloudinary dashboard

## Step 2: Get Your Cloudinary Credentials

1. In your Cloudinary dashboard, go to the **Account Details** section
2. Copy the following information:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

## Step 3: Add Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

Replace the placeholder values with your actual Cloudinary credentials.

## Step 4: Install Dependencies

The required dependencies have already been installed:

```bash
npm install cloudinary react-image-crop
```

## Step 5: Verify Installation

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/profile` in your application
3. Try uploading an image to test the functionality

## Features Included

### Image Upload with Cropping
- **File Validation**: Supports JPG, PNG, GIF formats
- **Size Limits**: Maximum 5MB file size
- **Circular Cropping**: Perfect for profile images
- **Real-time Preview**: See your crop before uploading
- **Automatic Optimization**: Cloudinary automatically optimizes images

### Profile Management
- **Profile Settings Page**: `/profile`
- **Image Upload Component**: Reusable component with cropping
- **Profile Information**: Update name, bio, title, contact info, social media
- **Session Updates**: Profile image updates reflect immediately

### API Endpoints
- `POST /api/user/upload-profile-image` - Upload and crop profile images
- `GET /api/user/profile` - Fetch user profile data
- `PUT /api/user/profile` - Update user profile information

## Security Features

- **Authentication Required**: All profile endpoints require user authentication
- **File Type Validation**: Only image files are accepted
- **Size Limits**: Prevents abuse with file size restrictions
- **Secure URLs**: Cloudinary provides secure HTTPS URLs
- **Old Image Cleanup**: Automatically deletes old profile images when new ones are uploaded

## Customization

### Image Transformations
You can customize image transformations in `lib/cloudinary.ts`:

```typescript
transformation: {
  width: 400,
  height: 400,
  crop: 'fill',
  gravity: 'face', // Automatically detects faces
  quality: 'auto',
  fetch_format: 'auto',
}
```

### Crop Settings
Modify crop settings in `components/ImageUpload.tsx`:

```typescript
const [crop, setCrop] = useState<Crop>({
  unit: '%',
  width: 90,
  height: 90,
  x: 5,
  y: 5,
});
```

## Troubleshooting

### Common Issues

1. **"Unauthorized" Error**
   - Check that your Cloudinary credentials are correct
   - Verify environment variables are loaded

2. **Image Not Uploading**
   - Check file size (must be under 5MB)
   - Ensure file is an image format
   - Check browser console for errors

3. **Crop Not Working**
   - Ensure `react-image-crop` CSS is imported
   - Check that the image is loaded before cropping

### Environment Variables Not Loading

If your environment variables aren't loading:

1. Restart your development server
2. Check that `.env.local` is in your project root
3. Verify variable names match exactly

## Support

For additional help:
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [React Image Crop Documentation](https://github.com/ricardo-ch/react-image-crop)
- Check the application logs for detailed error messages 