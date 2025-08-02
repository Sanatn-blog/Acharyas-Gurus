import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Content from '@/lib/models/Content';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'teacher') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const teacherId = session.user.id;

    const [
      totalContent,
      publishedContent,
      draftContent,
      contentStats,
    ] = await Promise.all([
      Content.countDocuments({ teacherId }),
      Content.countDocuments({ teacherId, status: 'published' }),
      Content.countDocuments({ teacherId, status: 'draft' }),
      Content.aggregate([
        { $match: { teacherId: teacherId } },
        {
          $group: {
            _id: null,
            totalViews: { $sum: '$views' },
            totalLikes: { $sum: '$likes' },
          },
        },
      ]),
    ]);

    const stats = {
      totalContent,
      publishedContent,
      draftContent,
      totalViews: contentStats[0]?.totalViews || 0,
      totalLikes: contentStats[0]?.totalLikes || 0,
    };

    return NextResponse.json(stats);
  } catch (error: unknown) {
    console.error('Error fetching teacher stats:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}