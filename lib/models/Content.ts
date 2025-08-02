import mongoose, { Schema, Document } from 'mongoose';

export interface IContent extends Document {
  teacherId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  excerpt: string;
  category: 'meditation' | 'philosophy' | 'daily-wisdom' | 'scripture' | 'practice';
  tags: string[];
  publishedAt?: Date;
  readingTime: number;
  featured: boolean;
  status: 'draft' | 'published';
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const contentSchema = new Schema<IContent>({
  teacherId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 500,
  },
  category: {
    type: String,
    enum: ['meditation', 'philosophy', 'daily-wisdom', 'scripture', 'practice'],
    required: true,
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true,
  }],
  publishedAt: {
    type: Date,
  },
  readingTime: {
    type: Number,
    required: true,
    min: 1,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
contentSchema.index({ teacherId: 1, status: 1 });
contentSchema.index({ category: 1, status: 1 });
contentSchema.index({ tags: 1 });
contentSchema.index({ featured: 1, status: 1 });
contentSchema.index({ publishedAt: -1 });

export default mongoose.models.Content || mongoose.model<IContent>('Content', contentSchema);