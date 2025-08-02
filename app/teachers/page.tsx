import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { teachers } from '@/lib/data/teachers';

export default function TeachersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800">
      <Navigation currentPage="teachers" />

      <main className="pt-16">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-white mb-6">
              Our Spiritual Teachers
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Meet the dedicated teachers who guide our community with wisdom, compassion, and deep spiritual insight.
            </p>
          </div>
        </div>

        {/* Teachers Grid */}
        <div className="py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">
              {teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                          <span className="text-3xl sm:text-4xl text-amber-600 dark:text-amber-400">🧘</span>
                        </div>
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-2">
                          {teacher.name}
                        </h3>
                        <p className="text-amber-600 dark:text-amber-400 font-medium mb-3">
                          {teacher.title}
                        </p>
                        <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
                          {teacher.bio}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4 justify-center sm:justify-start">
                          {teacher.specialties.slice(0, 3).map((specialty) => (
                            <span
                              key={specialty}
                              className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-center sm:justify-start">
                          <Link
                            href={`/teachers/${teacher.id}`}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
                          >
                            View Profile
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-amber-50 dark:bg-slate-900 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-6">
              Join Our Learning Community
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
              Connect with our teachers and fellow seekers as we explore the depths of spiritual wisdom together.
            </p>
            <Link
              href="/content"
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full font-medium transition-colors"
            >
              Explore Teachings
            </Link>
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