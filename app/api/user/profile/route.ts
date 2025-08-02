import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email })
      .select('-password -emailVerificationToken -emailVerificationExpires');

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      name: user.name,
      email: user.email,
      bio: user.bio,
      title: user.title,
      profileImage: user.profileImage,
      contactInfo: user.contactInfo || {},
      socialMedia: user.socialMedia || {},
    });
  } catch (error: unknown) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, bio, title, contactInfo, socialMedia } = body;

    // Validate required fields
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { message: 'Name is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Update user profile
    user.name = name.trim();
    user.bio = bio?.trim() || '';
    user.title = title?.trim() || '';
    user.contactInfo = {
      phone: contactInfo?.phone?.trim() || '',
      website: contactInfo?.website?.trim() || '',
    };
    user.socialMedia = {
      twitter: socialMedia?.twitter?.trim() || '',
      instagram: socialMedia?.instagram?.trim() || '',
      youtube: socialMedia?.youtube?.trim() || '',
    };

    await user.save();

    return NextResponse.json({
      message: 'Profile updated successfully',
      profile: {
        name: user.name,
        email: user.email,
        bio: user.bio,
        title: user.title,
        profileImage: user.profileImage,
        contactInfo: user.contactInfo,
        socialMedia: user.socialMedia,
      },
    });
  } catch (error: unknown) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 