import Link from "next/link";
import Navigation from "@/components/Navigation";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800">
      <Navigation currentPage="home" />

      {/* Hero Section */}
      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="text-center">
            <h2 className="text-4xl sm:text-6xl font-bold text-slate-800 dark:text-white mb-6">
              Learn from Our
              <span className="block text-amber-600 dark:text-amber-400">Acharyas and Gurus</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              A sacred space where revered Acharyas and enlightened Gurus share timeless wisdom and spiritual guidance, 
              illuminating the path for devoted seekers toward self-realization and divine consciousness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/teachers"
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full font-medium transition-colors"
              >
                Meet Our Gurus
              </Link>
              <Link 
                href="/content"
                className="border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-8 py-3 rounded-full font-medium transition-colors"
              >
                Explore Teachings
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white dark:bg-slate-800 py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-4">
                Our Spiritual Lineage
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Discover the foundation of our sacred tradition guided by Acharyas and Gurus
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-amber-600 dark:text-amber-400">👥</span>
                </div>
                <h4 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">Enlightened Gurus</h4>
                <p className="text-slate-600 dark:text-slate-300">
                  Receive guidance from realized masters and learned Acharyas who illuminate the path of spiritual awakening.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-amber-600 dark:text-amber-400">📖</span>
                </div>
                <h4 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">Sacred Teachings</h4>
                <p className="text-slate-600 dark:text-slate-300">
                  Access a rich collection of spiritual content, insights, and practical wisdom for daily life.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-amber-600 dark:text-amber-400">🧘</span>
                </div>
                <h4 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">Inner Peace</h4>
                <p className="text-slate-600 dark:text-slate-300">
                  Find tranquility and clarity through meditation, reflection, and community connection.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quote Section */}
        <div className="bg-amber-50 dark:bg-slate-900 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <blockquote className="text-xl sm:text-2xl italic text-slate-700 dark:text-slate-300 mb-4">
              &ldquo;The light of wisdom shines brightest when shared with others on the path.&rdquo;
            </blockquote>
            <p className="text-slate-500 dark:text-slate-400">— Ancient Vedic Wisdom</p>
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
