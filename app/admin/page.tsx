'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';

interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'user';
}

interface Teacher {
  _id: string;
  name: string;
  email: string;
  title: string;
  bio: string;
  specialties: string[];
  yearsOfExperience: number;
  joinedDate: string;
}

interface Content {
  _id: string;
  title: string;
  teacherId: {
    name: string;
    email: string;
  };
  category: string;
  status: string;
  publishedAt?: string;
  views: number;
  likes: number;
  featured: boolean;

}

interface Stats {
  totalTeachers: number;
  totalContent: number;
  totalUsers: number;
  publishedContent: number;
  draftContent: number;
  featuredContent: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'teachers' | 'content'>('overview');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [content, setContent] = useState<Content[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalTeachers: 0,
    totalContent: 0,
    totalUsers: 0,
    publishedContent: 0,
    draftContent: 0,
    featuredContent: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [contentFilter, setContentFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || (session.user as SessionUser).role !== 'admin') {
      router.push('/auth/signin');
      return;
    }

    fetchDashboardData();
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes] = await Promise.all([
        fetch('/api/admin/stats'),
      ]);

      if (statsRes.ok) {
        const dashboardStats = await statsRes.json();
        setStats(dashboardStats);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeachers = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        limit: '50'
      });
      
      const response = await fetch(`/api/admin/teachers?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTeachers(data.teachers);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  }, [searchTerm]);

  const fetchContent = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        status: contentFilter === 'all' ? '' : contentFilter,
        limit: '50'
      });
      
      const response = await fetch(`/api/admin/content?${params}`);
      if (response.ok) {
        const data = await response.json();
        setContent(data.content);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  }, [searchTerm, contentFilter]);

  useEffect(() => {
    if (activeTab === 'teachers') {
      fetchTeachers();
    } else if (activeTab === 'content') {
      fetchContent();
    }
  }, [activeTab, fetchTeachers, fetchContent]);

  const handleTeacherAction = async (teacherId: string, action: string) => {
    try {
      const response = await fetch('/api/admin/manage-teacher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teacherId, action }),
      });

      if (response.ok) {
        fetchTeachers();
        fetchDashboardData();
      } else {
        const error = await response.json();
        alert(error.message || 'Action failed');
      }
    } catch (error) {
      console.error('Error managing teacher:', error);
      alert('Action failed');
    }
  };

  const handleContentAction = async (contentId: string, action: string, reason?: string) => {
    try {
      const response = await fetch('/api/admin/manage-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contentId, action, reason }),
      });

      if (response.ok) {
        fetchContent();
        fetchDashboardData();
      } else {
        const error = await response.json();
        alert(error.message || 'Action failed');
      }
    } catch (error) {
      console.error('Error managing content:', error);
      alert('Action failed');
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
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Manage teachers, moderate content, and oversee community
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="-mb-px flex space-x-8">
              {(['overview', 'teachers', 'content'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="text-2xl text-blue-600">👥</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Teachers</p>
                      <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.totalTeachers}</p>

                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="text-2xl text-green-600">📚</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Content Posts</p>
                      <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.totalContent}</p>
                      <p className="text-xs text-green-600">
                        {stats.publishedContent} published • {stats.draftContent} drafts
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="text-2xl text-purple-600">👤</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Users</p>
                      <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.totalUsers}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="text-2xl text-amber-600">⭐</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Featured Content</p>
                      <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.featuredContent}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Teachers Tab */}
        {activeTab === 'teachers' && (
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Filters */}
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Search teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />

              </div>

              {/* Teachers List */}
              <div className="space-y-6">
                {teachers.map((teacher) => (
                  <div key={teacher._id} className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                            {teacher.name}
                          </h3>

                        </div>
                        <p className="text-amber-600 dark:text-amber-400 font-medium mb-2">
                          {teacher.title}
                        </p>
                        <p className="text-slate-600 dark:text-slate-300 mb-3">
                          {teacher.bio}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {teacher.specialties.map((specialty) => (
                            <span
                              key={specialty}
                              className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          <p>Email: {teacher.email}</p>
                          <p>Experience: {teacher.yearsOfExperience} years</p>
                          <p>Joined: {new Date(teacher.joinedDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this teacher? This action cannot be undone.')) {
                              handleTeacherAction(teacher._id, 'delete');
                            }
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Filters */}
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
                <select
                  value={contentFilter}
                  onChange={(e) => setContentFilter(e.target.value as 'all' | 'published' | 'draft')}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                >
                  <option value="all">All Content</option>
                  <option value="published">Published Only</option>
                  <option value="draft">Draft Only</option>
                </select>
              </div>

              {/* Content List */}
              <div className="space-y-6">
                {content.map((item) => (
                  <div key={item._id} className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                            {item.title}
                          </h3>
                          <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
                            item.status === 'published' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          }`}>
                            {item.status}
                          </span>
                          {item.featured && (
                            <span className="ml-2 px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-amber-600 dark:text-amber-400 font-medium mb-2">
                          By {item.teacherId.name}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400 mb-3">
                          <span className="capitalize">{item.category}</span>
                          <span>{item.views} views</span>
                          <span>{item.likes} likes</span>
                          {item.publishedAt && (
                            <span>Published: {new Date(item.publishedAt).toLocaleDateString()}</span>
                          )}
                        </div>

                      </div>
                      <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-wrap gap-2">
                        {item.status === 'published' ? (
                          <button
                            onClick={() => {
                              const reason = prompt('Reason for hiding (optional):');
                              handleContentAction(item._id, 'hide', reason || undefined);
                            }}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            Hide
                          </button>
                        ) : (
                          <button
                            onClick={() => handleContentAction(item._id, 'unhide')}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            Unhide
                          </button>
                        )}
                        {item.featured ? (
                          <button
                            onClick={() => handleContentAction(item._id, 'unfeature')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            Unfeature
                          </button>
                        ) : (
                          <button
                            onClick={() => handleContentAction(item._id, 'feature')}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            Feature
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
                              handleContentAction(item._id, 'delete');
                            }
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}