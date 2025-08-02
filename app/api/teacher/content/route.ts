import { NextRequest, NextResponse } from 'next/server';
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

    const content = await Content.find({
      teacherId: session.user.id,
    }).sort({ createdAt: -1 });

    return NextResponse.json(content);
  } catch (error: unknown) {
    console.error('Error fetching teacher content:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'teacher') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, excerpt, content, category, tags, readingTime } = await request.json();

    // Validate required fields
    if (!title || !excerpt || !content || !category) {
      return NextResponse.json(
        { message: 'Title, excerpt, content, and category are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Create new content (auto-published)
    const newContent = await Content.create({
      teacherId: session.user.id,
      title,
      excerpt,
      content,
      category,
      tags: tags || [],
      readingTime: readingTime || 5,
      status: 'published',
      publishedAt: new Date(),
    });

    return NextResponse.json(
      { 
        message: 'Content published successfully',
        content: newContent
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}