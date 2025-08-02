import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { generateOTP, sendResendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { message: 'Email is already verified' },
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
      }
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new OTP
    await User.findByIdAndUpdate(user._id, {
      emailVerificationOTP: otp,
      emailVerificationExpires: otpExpires,
      otpAttempts: 0,
      otpLastAttempt: undefined,
    });

    // Send verification email with OTP
    const emailSent = await sendResendVerificationEmail(email, user.name, otp);

    if (!emailSent) {
      return NextResponse.json(
        { message: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Verification OTP sent successfully. Please check your inbox.',
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 