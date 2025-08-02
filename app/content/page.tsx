import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { contentPosts, getFeaturedContent } from '@/lib/data/content';
import { getTeacherById } from '@/lib/data/teachers';

export default function ContentPage() {
  const featuredPosts = getFeaturedContent();
  const allPosts = contentPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const categories = [
    { id: 'all', name: 'All Teachings', emoji: '📚' },
    { id: 'meditation', name: 'Meditation', emoji: '🧘' },
    { id: 'philosophy', name: 'Philosophy', emoji: '💭' },
    { id: 'practice', name: 'Practice', emoji: '🙏' },
    { id: 'daily-wisdom', name: 'Daily Wisdom', emoji: '☀️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800">
      <Navigation currentPage="content" />

      <main className="pt-16">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-white mb-6">
              Sacred Teachings
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Discover timeless wisdom and practical guidance from our spiritual teachers, 
              designed to illuminate your path and deepen your understanding.
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="py-8 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full border border-amber-200 dark:border-amber-700 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                >
                  <span>{category.emoji}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Content */}
        {featuredPosts.length > 0 && (
          <div className="py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-8 text-center">
                Featured Teachings
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredPosts.slice(0, 2).map((post) => {
                  const teacher = getTeacherById(post.teacherId);
                  return (
                    <div
                      key={post.id}
                      className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="p-8">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mr-3">
                            <span className="text-amber-600 dark:text-amber-400">🧘</span>
                          </div>
                          <div>
                            <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                              {teacher?.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {teacher?.title}
                            </p>
                          </div>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-3">
                          {post.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                            <span className="capitalize">{post.category}</span>
                            <span>{post.readingTime} min read</span>
                          </div>
                          <Link
                            href={`/content/${post.id}`}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                          >
                            Read More
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* All Content */}
        <div className="bg-white dark:bg-slate-800 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-8 text-center">
              All Teachings
            </h2>
            <div className="space-y-8">
              {allPosts.map((post) => {
                const teacher = getTeacherById(post.teacherId);
                return (
                  <article
                    key={post.id}
                    className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 sm:p-8 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mr-4">
                        <span className="text-amber-600 dark:text-amber-400">🧘</span>
                      </div>
                      <div>
                        <Link
                          href={`/teachers/${teacher?.id}`}
                          className="text-amber-600 dark:text-amber-400 font-medium hover:text-amber-700 dark:hover:text-amber-300"
                        >
                          {teacher?.name}
                        </Link>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {teacher?.title}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-3">
                        <Link
                          href={`/content/${post.id}`}
                          className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                        <span className="capitalize bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                          {post.category}
                        </span>
                        <span>{post.readingTime} min read</span>
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <Link
                        href={`/content/${post.id}`}
                        className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium"
                      >
                        Read Full Article →
                      </Link>
                    </div>

                    {post.tags.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-amber-50 dark:bg-slate-900 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
              Stay Connected with Wisdom
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
              Receive the latest teachings and insights directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-full font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 dark:bg-slate-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-300">
            © 2025 Acharyas and Gurus. Spreading divine wisdom and spiritual enlightenment through sacred teachings.
          </p>
        </div>
      </footer>
    </div>
  );
}