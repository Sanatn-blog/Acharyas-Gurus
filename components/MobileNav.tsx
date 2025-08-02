'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface SessionUser {
  name?: string | null;
  email?: string | null;
  role?: string;
  profileImage?: string;
}

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
    closeMenu();
  };

  // Close menu when route changes
  useEffect(() => {
    closeMenu();
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const isActivePage = (page: string) => {
    if (page === 'home') return pathname === '/';
    return pathname.startsWith(`/${page}`);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="sm:hidden">
        <button 
          onClick={toggleMenu}
          type="button"
          className="relative p-2 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-md transition-colors z-[60] touch-manipulation"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu overlay and content */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-[55] sm:hidden"
            onClick={closeMenu}
            aria-hidden="true"
          />
          
          {/* Menu Panel */}
          <div className="fixed inset-0 top-16 bg-white dark:bg-slate-900 z-[58] sm:hidden overflow-y-auto">
            <div className="px-4 py-6">
              {/* Main Navigation */}
              <div className="space-y-2 mb-8">
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 mb-3">
                  Navigation
                </h3>
                
                <Link 
                  href="/" 
                  onClick={closeMenu}
                  className={`flex items-center px-3 py-3 text-base font-medium rounded-lg transition-all ${
                    isActivePage('home')
                      ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-600 dark:border-amber-400'
                      : 'text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Home
                </Link>
                
                <Link 
                  href="/teachers" 
                  onClick={closeMenu}
                  className={`flex items-center px-3 py-3 text-base font-medium rounded-lg transition-all ${
                    isActivePage('teachers')
                      ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-600 dark:border-amber-400'
                      : 'text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  Teachers
                </Link>
                
                <Link 
                  href="/content" 
                  onClick={closeMenu}
                  className={`flex items-center px-3 py-3 text-base font-medium rounded-lg transition-all ${
                    isActivePage('content')
                      ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-600 dark:border-amber-400'
                      : 'text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Teachings
                </Link>
              </div>

              {/* Authentication Section */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                {status === 'loading' ? (
                  <div className="space-y-3">
                    <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg h-12"></div>
                    <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg h-12"></div>
                  </div>
                ) : session?.user ? (
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3">
                      Account
                    </h3>
                    
                    {/* User Info */}
                    <div className="flex items-center px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      {(session.user as SessionUser)?.profileImage ? (
                        <Image
                          src={(session.user as SessionUser).profileImage!}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover mr-3"
                          width={40}
                          height={40}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-amber-600 text-white rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-semibold">
                            {session.user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {session.user.email}
                        </p>
                      </div>
                    </div>

                    {/* Profile Settings */}
                    <Link 
                      href="/profile"
                      onClick={closeMenu}
                      className={`flex items-center px-3 py-3 text-base font-medium rounded-lg transition-all ${
                        isActivePage('profile')
                          ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-600 dark:border-amber-400'
                          : 'text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                      }`}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile Settings
                    </Link>

                    {/* Role-specific Links */}
                    {(session.user as SessionUser)?.role === 'admin' && (
                      <Link 
                        href="/admin"
                        onClick={closeMenu}
                        className={`flex items-center px-3 py-3 text-base font-medium rounded-lg transition-all ${
                          isActivePage('admin')
                            ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-600 dark:border-amber-400'
                            : 'text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                        }`}
                      >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Admin Panel
                      </Link>
                    )}
                    
                    {(session.user as SessionUser)?.role === 'teacher' && (
                      <Link 
                        href="/teacher/dashboard"
                        onClick={closeMenu}
                        className={`flex items-center px-3 py-3 text-base font-medium rounded-lg transition-all ${
                          isActivePage('teacher')
                            ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-600 dark:border-amber-400'
                            : 'text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                        }`}
                      >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Dashboard
                      </Link>
                    )}

                    {/* Sign Out Button */}
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-3 py-3 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3">
                      Get Started
                    </h3>
                    
                    <Link 
                      href="/auth/signin"
                      onClick={closeMenu}
                      className="flex items-center w-full px-3 py-3 text-base font-medium text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Sign In
                    </Link>
                    
                    <Link 
                      href="/auth/signup"
                      onClick={closeMenu}
                      className="flex items-center justify-center w-full px-3 py-3 text-base font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-all"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Join Our Community
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}