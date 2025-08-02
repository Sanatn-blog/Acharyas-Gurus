'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

interface Content {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  status: 'draft' | 'published';
  views: number;
  likes: number;
  publishedAt?: string;
  createdAt: string;
}

interface TeacherStats {
  totalContent: number;
  publishedContent: number;
  draftContent: number;
  totalViews: number;
  totalLikes: number;
}

export default function TeacherDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [content, setContent] = useState<Content[]>([]);
  const [stats, setStats] = useState<TeacherStats>({
    totalContent: 0,
    publishedContent: 0,
    draftContent: 0,
    totalViews: 0,
    totalLikes: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user.role !== 'teacher') {
      router.push('/auth/signin');
      return;
    }



    fetchDashboardData();
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      const [contentRes, statsRes] = await Promise.all([
        fetch('/api/teacher/content'),
        fetch('/api/teacher/stats'),
      ]);

      if (contentRes.ok) {
        const contentData = await contentRes.json();
        setContent(contentData);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Published';
      default:
        return 'Draft';
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800">
        <Navigation />
        <main className="pt-16">
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800">
      <Navigation />

      <main className="pt-16">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                  Teacher Dashboard
                </h1>
                <p className="text-slate-600 dark:text-slate-300 mt-2">
                  Welcome back, {session?.user?.name}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Link
                  href="/teacher/create-content"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Create New Content
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl text-blue-600">📄</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Content</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.totalContent}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl text-green-600">✅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Published</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.publishedContent}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl text-yellow-600">⏳</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Drafts</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.draftContent}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl text-purple-600">👁️</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Views</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.totalViews}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl text-red-600">❤️</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Likes</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.totalLikes}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content List */}
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                  Your Content
                </h2>
              </div>

              {content.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-amber-600 dark:text-amber-400">📝</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                    No content yet
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-6">
                    Start sharing your spiritual wisdom by creating your first piece of content.
                  </p>
                  <Link
                    href="/teacher/create-content"
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Create Your First Content
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  {content.map((item) => (
                    <div key={item._id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                              {item.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                              {getStatusText(item.status)}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 mb-3">
                            {item.excerpt}
                          </p>
                          <div className="flex items-center space-x-6 text-sm text-slate-500 dark:text-slate-400">
                            <span className="capitalize">{item.category}</span>
                            <span>{item.views} views</span>
                            <span>{item.likes} likes</span>
                            <span>
                              {item.publishedAt 
                                ? `Published ${new Date(item.publishedAt).toLocaleDateString()}`
                                : `Created ${new Date(item.createdAt).toLocaleDateString()}`
                              }
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-6 flex space-x-3">
                          <Link
                            href={`/teacher/edit-content/${item._id}`}
                            className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium"
                          >
                            Edit
                          </Link>
                          {item.status === 'published' && (
                            <Link
                              href={`/content/${item._id}`}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                            >
                              View
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}