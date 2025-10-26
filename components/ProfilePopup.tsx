"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useSession } from "next-auth/react";

const ProfilePopup: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

useEffect(() => {
  let didRun = false;

  const fetchProfileStatus = async () => {
    if (didRun) return; // ✅ prevent double-run in StrictMode
    didRun = true;

      try {
        const role = session?.user?.role;

        // ✅ Skip popup for admin, super_admin, hr
        if (role === "admin") {
          setShowModal(false);
          setLoading(false);
          localStorage.removeItem("profileSuccess");
          return;
        }

        const res = await axios.get("/api/user/profile-status");
        const isIncomplete =
          res.data.profileCompleted === 0 ||
          res.data.profileCompleted === "0" ||
          res.data.profileCompleted === false;
        setShowModal(isIncomplete);
      } catch (err) {
        console.error("Error fetching profile status:", err);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchProfileStatus();
    }
  }, [session, status]);

  useEffect(() => {
    const role = session?.user?.role;

    // ✅ Only show toast for non-admin users
    if (
      localStorage.getItem("profileSuccess") === "true" &&
      role !== "admin"
    ) {
      setShowModal(false);
      toast.success("Profile updated successfully!", {
        duration: 3000,
        position: "top-center",
      });
    }

    // Always clear flag
    localStorage.removeItem("profileSuccess");
  }, [session]);

  if (loading) return null;
  if (!showModal) return <Toaster />;

  return (
    <>
      <Toaster position="top-center" />

      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"></div>

      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                   z-50 bg-white rounded-2xl shadow-2xl p-8 w-11/12 max-w-md 
                   flex flex-col items-center justify-center border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Complete Your Profile
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Your profile information is incomplete. Please update it to continue.
        </p>

        <button
          onClick={() => {
            setShowModal(false);
            router.push("/user/profile");
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md"
        >
          Update Profile
        </button>
      </div>
    </>
  );
};

export default ProfilePopup;
