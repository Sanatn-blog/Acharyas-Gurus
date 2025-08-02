import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    const { 
      name, 
      email, 
      password, 
      title, 
      bio, 
      specialties, 
      yearsOfExperience,
      contactInfo,
      socialMedia 
    } = await request.json();

    // Validate required fields
    if (!name || !email || !password || !title || !bio || !specialties || specialties.length === 0) {
      return NextResponse.json(
        { message: 'Name, email, password, title, bio, and specialties are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create teacher user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'teacher',
      title,
      bio,
      specialties,
      yearsOfExperience: yearsOfExperience || 0,
      contactInfo: contactInfo || {},
      socialMedia: socialMedia || {},
    });

    // TODO: Send welcome email to new teacher
    // TODO: Send confirmation email to teacher

    return NextResponse.json(
      { 
        message: 'Teacher registration completed successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Teacher registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}