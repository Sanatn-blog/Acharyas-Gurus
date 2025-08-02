export interface Teacher {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
  specialties: string[];
  yearsOfExperience: number;
  contactInfo: {
    email?: string;
    phone?: string;
    website?: string;
  };
  socialMedia: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  joinedDate: string;
}

export interface ContentPost {
  id: string;
  teacherId: string;
  title: string;
  content: string;
  excerpt: string;
  category: 'meditation' | 'philosophy' | 'daily-wisdom' | 'scripture' | 'practice';
  tags: string[];
  publishedAt: string;
  readingTime: number;
  featured: boolean;
}

export interface TeacherContentStats {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  categories: Record<string, number>;
}

// NextAuth type extensions
declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'teacher' | 'user';
    isEmailVerified: boolean;
    profileImage?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'admin' | 'teacher' | 'user';
      isEmailVerified: boolean;
      profileImage?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: 'admin' | 'teacher' | 'user';
    isEmailVerified: boolean;
    profileImage?: string;
  }
}