'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User, Lock, Mail, Calendar, Shield, UserCircle } from 'lucide-react';

interface ProfileFormData {
  name: string;
  email: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const EditProfilePage = () => {
  const { data: session, update } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileData, setProfileData] = useState<ProfileFormData>({
    name: session?.user?.name || '',
    email: session?.user?.email || ''
  });

  // Update form data when session changes
  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || '',
        email: session.user.email || ''
      });
    }
  }, [session]);

  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccess('Profile updated successfully');

      console.log(data);
      console.log(profileData);

      await update({
        ...session,
        user: {
          ...session?.user,
          name: profileData.name,
          email: profileData.email
        }
      });

    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password');
      }

      setSuccess('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Edit Profile</h2>
        <nav className="text-sm text-gray-500">
          <a href="/admin/dashboard" className="hover:underline">Dashboard</a> / <span>Edit Profile</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Info Card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
                <UserCircle className="w-16 h-16 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold">{session.user?.name}</h3>
              <p className="text-gray-500">{session.user?.role}</p>
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                <span className="text-sm">{session.user?.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Shield className="w-4 h-4 mr-2" />
                <span className="text-sm">Account ID: {session.user?.account_id}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  Joined: {new Date(session.user?.created_at || '').toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Forms Section */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow">
            {/* Tabs */}
            <div className="border-b">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${
                    activeTab === 'profile'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Profile Details
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${
                    activeTab === 'password'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  Change Password
                </button>
              </div>
            </div>

            <div className="p-6">
              {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded mb-6">{error}</div>
              )}
              {success && (
                <div className="bg-green-50 text-green-500 p-4 rounded mb-6">{success}</div>
              )}

              {activeTab === 'profile' ? (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      readOnly 
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      readOnly 
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required 
                    />
                  </div>

                  <div className="flex justify-end">
                   { /* <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {isLoading ? 'Updating...' : 'Update Profile'}
                    </button>  */ }
                  </div>
                </form>
              ) : (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {isLoading ? 'Updating...' : 'Change Password'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;