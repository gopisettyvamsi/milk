'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface ProfileUpdateToastProps {
  profile?: number;
}

const ProfileUpdateToast = ({ profile }: ProfileUpdateToastProps) => {
  const { data: session, status } = useSession();
  const [checked, setChecked] = useState(false);
  const [showed, setShowed] = useState(false);

  useEffect(() => {
    if (status === 'loading' || checked) return;

    const checkProfileStatus = async () => {
      try {
        const userId = (session?.user as any)?.id;
        if (!userId) return;

        // ✅ Fetch latest value from DB instead of cached session
        const res = await fetch(`/api/user-details?user_id=${userId}`);
        if (!res.ok) return;

        const data = await res.json();
        const isProfileComplete = data?.profile === 1 || profile === 1;

        // Close if profile = 1
        if (isProfileComplete) {
          toast.dismiss('profile-update-toast');
          const backdrop = document.getElementById('profile-update-backdrop');
          if (backdrop) {
            backdrop.remove();
            document.body.style.overflow = '';
          }
          setChecked(true);
          setShowed(false);
          return;
        }

        // Show popup only if profile = 0 and not already shown
        if (!isProfileComplete && !showed) {
          const backdrop = document.createElement('div');
          backdrop.id = 'profile-update-backdrop';
          backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 9998;
          `;
          document.body.appendChild(backdrop);
          document.body.style.overflow = 'hidden';

          toast.custom(
            (t) => (
              <div
                className={`${
                  t.visible ? 'animate-enter' : 'animate-leave'
                } relative max-w-md w-full bg-white shadow-xl rounded-lg ring-1 ring-black ring-opacity-5`}
                style={{ zIndex: 9999 }}
              >
                <div className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-100">
                        <span className="text-red-600 text-2xl">⚠️</span>
                      </div>
                    </div>

                    <div className="ml-4 flex-1">
                      <p className="text-base font-semibold text-gray-900">
                        Profile Update Required
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        Please update your profile to continue using all features.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={() => (window.location.href = '/user/profile')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Update Profile
                    </button>
                  </div>
                </div>
              </div>
            ),
            {
              id: 'profile-update-toast',
              duration: Infinity,
              position: 'top-center',
            }
          );

          setShowed(true);
        }
      } catch (err) {
        console.error('Error checking profile:', err);
      }
    };

    checkProfileStatus();
  }, [session, status, profile, checked, showed]);

  return null;
};

export default ProfileUpdateToast;
