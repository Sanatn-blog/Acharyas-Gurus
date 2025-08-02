import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'teacher' | 'user';
  isEmailVerified: boolean;
  emailVerificationOTP?: string;
  emailVerificationExpires?: Date;
  otpAttempts?: number;
  otpLastAttempt?: Date;
  profileImage?: string;
  bio?: string;
  title?: string;
  specialties: string[];
  yearsOfExperience?: number;
  contactInfo: {
    phone?: string;
    website?: string;
  };
  socialMedia: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  joinedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'teacher', 'user'],
    default: 'user',
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationOTP: {
    type: String,
  },
  emailVerificationExpires: {
    type: Date,
  },
  otpAttempts: {
    type: Number,
    default: 0,
  },
  otpLastAttempt: {
    type: Date,
  },
  profileImage: {
    type: String,
  },
  bio: {
    type: String,
  },
  title: {
    type: String,
  },
  specialties: [{
    type: String,
  }],
  yearsOfExperience: {
    type: Number,
  },
  contactInfo: {
    phone: String,
    website: String,
  },
  socialMedia: {
    twitter: String,
    instagram: String,
    youtube: String,
  },
  joinedDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for better query performance
userSchema.index({ role: 1 });
userSchema.index({ emailVerificationOTP: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);