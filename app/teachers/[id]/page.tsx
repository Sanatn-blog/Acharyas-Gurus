import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { getTeacherById, teachers } from '@/lib/data/teachers';
import { getContentByTeacher } from '@/lib/data/content';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return teachers.map((teacher) => ({
    id: teacher.id,
  }));
}

export default async function TeacherProfile({ params }: Props) {
  const { id } = await params;
  const teacher = getTeacherById(id);
  
  if (!teacher) {
    notFound();
  }

  const teacherContent = getContentByTeacher(teacher.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800">
      <Navigation currentPage="teachers" />

      <main className="pt-16">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <Link 
                href="/teachers"
                className="inline-flex items-center text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 mb-6"
              >
                ← Back to Teachers
              </Link>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl text-amber-600 dark:text-amber-400">🧘</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-white mb-4">
                {teacher.name}
              </h1>
              <p className="text-xl text-amber-600 dark:text-amber-400 font-medium mb-6">
                {teacher.title}
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
                {teacher.bio}
              </p>
            </div>
          </div>
        </div>

        {/* Teacher Details */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Specialties & Experience */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
                  Areas of Expertise
                </h2>
                <div className="flex flex-wrap gap-3 mb-8">
                  {teacher.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                  <p className="text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-800 dark:text-white">Experience:</span> {teacher.yearsOfExperience} years
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 mt-2">
                    <span className="font-semibold text-slate-800 dark:text-white">Joined Community:</span> {new Date(teacher.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </p>
                </div>
              </div>

              {/* Contact & Social */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
                  Connect
                </h2>
                <div className="space-y-4">
                  {teacher.contactInfo.email && (
                    <div className="flex items-center space-x-3">
                      <span className="text-amber-600 dark:text-amber-400">📧</span>
                      <a 
                        href={`mailto:${teacher.contactInfo.email}`}
                        className="text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400"
                      >
                        {teacher.contactInfo.email}
                      </a>
                    </div>
                  )}
                  {teacher.contactInfo.phone && (
                    <div className="flex items-center space-x-3">
                      <span className="text-amber-600 dark:text-amber-400">📞</span>
                      <a 
                        href={`tel:${teacher.contactInfo.phone}`}
                        className="text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400"
                      >
                        {teacher.contactInfo.phone}
                      </a>
                    </div>
                  )}
                  {teacher.contactInfo.website && (
                    <div className="flex items-center space-x-3">
                      <span className="text-amber-600 dark:text-amber-400">🌐</span>
                      <a 
                        href={teacher.contactInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400"
                      >
                        Personal Website
                      </a>
                    </div>
                  )}
                </div>

                {/* Social Media */}
                {(teacher.socialMedia.youtube || teacher.socialMedia.instagram || teacher.socialMedia.twitter) && (
                  <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Follow</h3>
                    <div className="space-y-3">
                      {teacher.socialMedia.youtube && (
                        <div className="flex items-center space-x-3">
                          <span className="text-red-500">🎥</span>
                          <span className="text-slate-600 dark:text-slate-300">{teacher.socialMedia.youtube}</span>
                        </div>
                      )}
                      {teacher.socialMedia.instagram && (
                        <div className="flex items-center space-x-3">
                          <span className="text-pink-500">📸</span>
                          <span className="text-slate-600 dark:text-slate-300">{teacher.socialMedia.instagram}</span>
                        </div>
                      )}
                      {teacher.socialMedia.twitter && (
                        <div className="flex items-center space-x-3">
                          <span className="text-blue-500">🐦</span>
                          <span className="text-slate-600 dark:text-slate-300">{teacher.socialMedia.twitter}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Teachings */}
        {teacherContent.length > 0 && (
          <div className="bg-white dark:bg-slate-800 py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-8 text-center">
                Recent Teachings
              </h2>
              <div className="space-y-6">
                {teacherContent.slice(0, 3).map((post) => (
                  <div
                    key={post.id}
                    className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                          {post.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                          <span className="capitalize">{post.category}</span>
                          <span>{post.readingTime} min read</span>
                          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <Link
                          href={`/content/${post.id}`}
                          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                        >
                          Read More
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {teacherContent.length > 3 && (
                <div className="text-center mt-8">
                  <Link
                    href={`/content?teacher=${teacher.id}`}
                    className="border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-6 py-3 rounded-full font-medium transition-colors"
                  >
                    View All Teachings
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
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