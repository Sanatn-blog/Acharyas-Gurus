import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { uploadImage, deleteImage } from '@/lib/cloudinary';

interface CloudinaryTransformation {
  width?: number;
  height?: number;
  crop?: string;
  gravity?: string;
  quality?: string;
  fetch_format?: string;
  x?: number;
  y?: number;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const formData = await request.formData();
    const file = formData.get('image') as File;
    const cropData = formData.get('cropData') as string;

    if (!file) {
      return NextResponse.json(
        { message: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { message: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Parse crop data if provided
    let transformation: CloudinaryTransformation = {
      width: 400,
      height: 400,
      crop: 'fill',
      gravity: 'face',
      quality: 'auto',
      fetch_format: 'auto',
    };

    if (cropData) {
      try {
        const crop = JSON.parse(cropData);
        transformation = {
          ...transformation,
          width: Math.round(crop.width),
          height: Math.round(crop.height),
          x: Math.round(crop.x),
          y: Math.round(crop.y),
          crop: 'crop',
        };
      } catch (error) {
        console.error('Error parsing crop data:', error);
      }
    }

    // Upload to Cloudinary
    const uploadResult = await uploadImage(buffer, {
      folder: 'arya-samaj/profiles',
      transformation,
    }) as { secure_url: string; public_id: string };

    // Get current user
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Delete old profile image if exists
    if (user.profileImage) {
      try {
        const oldPublicId = user.profileImage.split('/').pop()?.split('.')[0];
        if (oldPublicId) {
          await deleteImage(`arya-samaj/profiles/${oldPublicId}`);
        }
      } catch (error) {
        console.error('Error deleting old profile image:', error);
      }
    }

    // Update user profile image
    user.profileImage = uploadResult.secure_url;
    await user.save();

    return NextResponse.json({
      message: 'Profile image uploaded successfully',
      imageUrl: uploadResult.secure_url,
    });
  } catch (error: unknown) {
    console.error('Error uploading profile image:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 