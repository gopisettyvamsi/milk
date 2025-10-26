"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User, Lock, Mail, Calendar, UserCircle, Eye, EyeOff } from "lucide-react";
import UserLayout from "@/components/layouts/UserLayout";

interface ProfileFormData {
  name: string;
  email: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const UserProfilePage = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  const [profileData, setProfileData] = useState<ProfileFormData>({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
  });

  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || "",
        email: session.user.email || "",
      });
    }
  }, [session]);

  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // States for toggling password visibility
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/user/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update password");

      setSuccess("Password updated successfully");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) return <div className="text-center py-4">Loading...</div>;

  return (
    <UserLayout>
      <div className="container mx-auto px-2 sm:px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Profile</h2>
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
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    Joined: {new Date(session.user?.created_at || "").toLocaleDateString()}
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
                  {/* <button
                    onClick={() => setActiveTab("profile")}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${
                      activeTab === "profile"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    Profile Details
                  </button> */}
                  <button
                    // onClick={() => setActiveTab("password")}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${
                      activeTab === "password"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    Change Password
                  </button>
                </div>
              </div>

              <div className="p-6">
                {error && <div className="bg-red-50 text-red-500 p-4 rounded mb-6">{error}</div>}
                {success && <div className="bg-green-50 text-green-500 p-4 rounded mb-6">{success}</div>}

                <form
                  onSubmit={handlePasswordSubmit}
                  className="space-y-6 md:space-y-0 md:flex md:gap-8"
                >
                  <div className="flex-1 grid grid-cols-1 gap-6">
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrent ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, currentPassword: e.target.value })
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrent((prev) => !prev)}
                          className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                        >
                          {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNew ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, newPassword: e.target.value })
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew((prev) => !prev)}
                          className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                        >
                          {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((prev) => !prev)}
                          className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                        >
                          {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                      >
                        {isLoading ? "Updating..." : "Change Password"}
                      </button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="flex-1 flex items-start md:items-center justify-center md:justify-start mt-6 md:mt-0">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h1 className="font-bold mb-2 text-red-700">NOTE :</h1>
                      <p className="text-sm text-gray-500">
                        Please use a strong password and do not share it with anyone.
                      </p>
                      <ul className="text-xs text-gray-400 mt-2 list-disc list-inside">
                        <li>Must include at least one uppercase letter (A-Z)</li>
                        <li>Must include at least one lowercase letter (a-z)</li>
                        <li>Must include at least one number (0-9)</li>
                        <li>Must include at least one special character (e.g., !@#$%^&amp;*)</li>
                      </ul>
                    </div>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserProfilePage;
