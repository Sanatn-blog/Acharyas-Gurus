import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Content from '@/lib/models/Content';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const [
      totalTeachers,
      totalContent,
      publishedContent,
      draftContent,
      featuredContent,
      totalUsers,
    ] = await Promise.all([
      User.countDocuments({ role: 'teacher' }),
      Content.countDocuments(),
      Content.countDocuments({ status: 'published' }),
      Content.countDocuments({ status: 'draft' }),
      Content.countDocuments({ featured: true }),
      User.countDocuments(),
    ]);

    const stats = {
      totalTeachers,
      totalContent,
      publishedContent,
      draftContent,
      featuredContent,
      totalUsers,
    };

    return NextResponse.json(stats);
  } catch (error: unknown) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}