import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Content from '@/lib/models/Content';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { contentId, action, reason } = await request.json();

    if (!contentId || !action) {
      return NextResponse.json(
        { message: 'Content ID and action are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const content = await Content.findById(contentId);
    if (!content) {
      return NextResponse.json(
        { message: 'Content not found' },
        { status: 404 }
      );
    }

    let updateData: Record<string, unknown> = {};
    let message = '';

    switch (action) {
      case 'hide':
        updateData = { status: 'rejected', moderationNotes: reason || 'Hidden by admin' };
        message = 'Content hidden successfully';
        break;
      case 'unhide':
        updateData = { status: 'published', moderationNotes: '' };
        message = 'Content made visible successfully';
        break;
      case 'feature':
        updateData = { featured: true };
        message = 'Content featured successfully';
        break;
      case 'unfeature':
        updateData = { featured: false };
        message = 'Content unfeatured successfully';
        break;
      case 'delete':
        await Content.findByIdAndDelete(contentId);
        return NextResponse.json({ message: 'Content deleted successfully' });
      default:
        return NextResponse.json(
          { message: 'Invalid action' },
          { status: 400 }
        );
    }

    await Content.findByIdAndUpdate(contentId, updateData);

    // TODO: Send notification to content author
    // TODO: Log admin action for audit trail

    return NextResponse.json({ message });
  } catch (error: unknown) {
    console.error('Error managing content:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}