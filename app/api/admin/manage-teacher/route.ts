import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { teacherId, action } = await request.json();

    if (!teacherId || !action) {
      return NextResponse.json(
        { message: 'Teacher ID and action are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== 'teacher') {
      return NextResponse.json(
        { message: 'Teacher not found' },
        { status: 404 }
      );
    }

    if (action === 'delete') {
      await User.findByIdAndDelete(teacherId);
      return NextResponse.json({ message: 'Teacher deleted successfully' });
    } else {
      return NextResponse.json(
        { message: 'Invalid action' },
        { status: 400 }
      );
    }


  } catch (error: unknown) {
    console.error('Error managing teacher:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}