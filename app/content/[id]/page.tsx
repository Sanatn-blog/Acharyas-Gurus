import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { getContentById, contentPosts } from '@/lib/data/content';
import { getTeacherById } from '@/lib/data/teachers';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return contentPosts.map((post) => ({
    id: post.id,
  }));
}

export default async function ContentPost({ params }: Props) {
  const { id } = await params;
  const post = getContentById(id);
  
  if (!post) {
    notFound();
  }

  const teacher = getTeacherById(post.teacherId);

  // Convert markdown-style content to HTML for display
  const contentHtml = post.content
    .split('\n\n')
    .map(paragraph => {
      if (paragraph.startsWith('## ')) {
        return `<h2 class="text-2xl font-bold text-slate-800 dark:text-white mb-4 mt-8">${paragraph.slice(3)}</h2>`;
      }
      if (paragraph.startsWith('### ')) {
        return `<h3 class="text-xl font-semibold text-slate-800 dark:text-white mb-3 mt-6">${paragraph.slice(4)}</h3>`;
      }
      if (paragraph.match(/^\d+\./)) {
        const items = paragraph.split('\n').map(item => {
          if (item.match(/^\d+\./)) {
            return `<li class="mb-2">${item.replace(/^\d+\.\s*/, '')}</li>`;
          }
          return item;
        });
        return `<ol class="list-decimal list-inside space-y-2 mb-4">${items.join('')}</ol>`;
      }
      if (paragraph.includes('**') && paragraph.includes('**')) {
        paragraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
      }
      return `<p class="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">${paragraph}</p>`;
    })
    .join('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800">
      <Navigation currentPage="content" />

      <main className="pt-16">
        {/* Article Header */}
        <div className="bg-white dark:bg-slate-800 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <Link 
                href="/content"
                className="inline-flex items-center text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 mb-6"
              >
                ← Back to Teachings
              </Link>
            </div>

            {/* Teacher Info */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mr-4">
                  <span className="text-amber-600 dark:text-amber-400">🧘</span>
                </div>
                <div className="text-center sm:text-left">
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
            </div>

            {/* Article Title & Meta */}
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white mb-6">
                {post.title}
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
                {post.excerpt}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                <span className="capitalize bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full">
                  {post.category}
                </span>
                <span>{post.readingTime} min read</span>
                <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 sm:p-12 shadow-lg">
              <div 
                className="prose prose-slate dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
              
              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Teacher CTA */}
        <div className="bg-amber-50 dark:bg-slate-900 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl text-amber-600 dark:text-amber-400">🧘</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-4">
              Learn More from {teacher?.name}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              {teacher?.bio}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/teachers/${teacher?.id}`}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
              >
                View Teacher Profile
              </Link>
              <Link
                href="/content"
                className="border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-6 py-3 rounded-full font-medium transition-colors"
              >
                More Teachings
              </Link>
            </div>
          </div>
        </div>

        {/* Related Content */}
        <div className="bg-white dark:bg-slate-800 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-8 text-center">
              Continue Your Journey
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {contentPosts
                .filter(p => p.id !== post.id && p.category === post.category)
                .slice(0, 3)
                .map((relatedPost) => {
                  const relatedTeacher = getTeacherById(relatedPost.teacherId);
                  return (
                    <div
                      key={relatedPost.id}
                      className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mr-3">
                          <span className="text-amber-600 dark:text-amber-400 text-sm">🧘</span>
                        </div>
                        <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                          {relatedTeacher?.name}
                        </p>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                        <Link
                          href={`/content/${relatedPost.id}`}
                          className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                        >
                          {relatedPost.title}
                        </Link>
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm mb-3">
                        {relatedPost.excerpt}
                      </p>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {relatedPost.readingTime} min read
                      </div>
                    </div>
                  );
                })}
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