import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user with the email and OTP
    const user = await User.findOne({
      email: email.toLowerCase(),
      emailVerificationOTP: otp,
      emailVerificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Check if user has exceeded OTP attempts
    if (user.otpAttempts && user.otpAttempts >= 5) {
      const timeSinceLastAttempt = user.otpLastAttempt ? 
        Date.now() - user.otpLastAttempt.getTime() : 0;
      
      // Reset attempts after 15 minutes
      if (timeSinceLastAttempt < 15 * 60 * 1000) {
        return NextResponse.json(
          { message: 'Too many failed attempts. Please try again in 15 minutes.' },
          { status: 429 }
        );
      } else {
        // Reset attempts after timeout
        await User.findByIdAndUpdate(user._id, {
          otpAttempts: 0,
          otpLastAttempt: undefined,
        });
      }
    }

    // Update user to verified
    await User.findByIdAndUpdate(user._id, {
      isEmailVerified: true,
      emailVerificationOTP: undefined,
      emailVerificationExpires: undefined,
      otpAttempts: 0,
      otpLastAttempt: undefined,
    });

    return NextResponse.json(
      { 
        message: 'Email verified successfully! You can now sign in to your account.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Keep the GET method for backward compatibility (redirects to verification page)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { message: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Redirect to verification page with token (for backward compatibility)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`);
  } catch (error: unknown) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 