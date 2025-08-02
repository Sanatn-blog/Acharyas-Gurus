'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import ImageUpload from '@/components/ImageUpload';
import { Crop } from 'react-image-crop';

interface UserProfile {
  name: string;
  email: string;
  bio?: string;
  title?: string;
  profileImage?: string;
  contactInfo: {
    phone?: string;
    website?: string;
  };
  socialMedia: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/signin');
      return;
    }

    fetchProfile();
  }, [session, status, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File, cropData?: Crop) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      if (cropData) {
        formData.append('cropData', JSON.stringify(cropData));
      }

      const response = await fetch('/api/user/upload-profile-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload image');
      }

      const result = await response.json();
      
      // Update local state
      if (profile) {
        setProfile({
          ...profile,
          profileImage: result.imageUrl,
        });
      }

      // Update session
      await update();

      setMessage({
        type: 'success',
        text: 'Profile image updated successfully!',
      });

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      throw error;
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      setMessage({
        type: 'success',
        text: 'Profile updated successfully!',
      });

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to update profile',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (!profile) return;

    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const parentValue = profile[parent as keyof UserProfile];
      setProfile({
        ...profile,
        [parent]: {
          ...(typeof parentValue === 'object' && parentValue !== null ? parentValue : {}),
          [child]: value,
        },
      });
    } else {
      setProfile({
        ...profile,
        [field]: value,
      });
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800">
        <Navigation />
        <main className="pt-16">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                </div>
                <div className="lg:col-span-2">
                  <div className="space-y-4">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                    <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                    <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800">
        <Navigation />
        <main className="pt-16">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Profile not found
              </h1>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800">
      <Navigation />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Profile Settings
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Manage your profile information and preferences
            </p>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
            }`}>
              <p className={`text-sm ${
                message.type === 'success' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {message.text}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Image Section */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Profile Image
                </h2>
                <ImageUpload
                  onUpload={handleImageUpload}
                  currentImageUrl={profile.profileImage}
                  aspectRatio={1}
                  maxSize={5}
                />
              </div>
            </div>

            {/* Profile Information Section */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
                  Profile Information
                </h2>

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg
                                 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                                 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                                 dark:focus:ring-amber-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg
                                 bg-slate-50 dark:bg-slate-600 text-slate-500 dark:text-slate-400
                                 cursor-not-allowed"
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Email cannot be changed
                      </p>
                    </div>
                  </div>

                  {/* Title and Bio */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={profile.title || ''}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., Yoga Teacher, Meditation Guide"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg
                               bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                               focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                               dark:focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profile.bio || ''}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={4}
                      placeholder="Tell us about yourself..."
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg
                               bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                               focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                               dark:focus:ring-amber-400 resize-none"
                    />
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profile.contactInfo.phone || ''}
                        onChange={(e) => handleInputChange('contactInfo.phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg
                                 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                                 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                                 dark:focus:ring-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={profile.contactInfo.website || ''}
                        onChange={(e) => handleInputChange('contactInfo.website', e.target.value)}
                        placeholder="https://yourwebsite.com"
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg
                                 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                                 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                                 dark:focus:ring-amber-400"
                      />
                    </div>
                  </div>

                  {/* Social Media */}
                  <div>
                    <h3 className="text-md font-medium text-slate-700 dark:text-slate-300 mb-4">
                      Social Media
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Twitter
                        </label>
                        <input
                          type="url"
                          value={profile.socialMedia.twitter || ''}
                          onChange={(e) => handleInputChange('socialMedia.twitter', e.target.value)}
                          placeholder="https://twitter.com/username"
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg
                                   bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                                   focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                                   dark:focus:ring-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Instagram
                        </label>
                        <input
                          type="url"
                          value={profile.socialMedia.instagram || ''}
                          onChange={(e) => handleInputChange('socialMedia.instagram', e.target.value)}
                          placeholder="https://instagram.com/username"
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg
                                   bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                                   focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                                   dark:focus:ring-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          YouTube
                        </label>
                        <input
                          type="url"
                          value={profile.socialMedia.youtube || ''}
                          onChange={(e) => handleInputChange('socialMedia.youtube', e.target.value)}
                          placeholder="https://youtube.com/@channel"
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg
                                   bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                                   focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                                   dark:focus:ring-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2 bg-amber-600 text-white rounded-lg font-medium
                               hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
                               disabled:opacity-50 disabled:cursor-not-allowed
                               dark:focus:ring-offset-slate-800"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 