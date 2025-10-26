'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  User,
  Phone,
  MapPin,
  GraduationCap,
  Trophy,
  BookOpen,
  Calendar,
  ArrowLeft,
  Briefcase,
  FileText,
  Globe,
  Building2,
  Layers,
  Flag,
} from 'lucide-react';

interface UserDetails {
  id: number;
  user_id: number;
  prefix: string;
  other_prefix: string;
  firstname: string;
  lastname: string;
  specialization: string;
  designation: string;
  phonenumber: string;
  qualification: string;
  address: string;
  state: string;
  nationality: string;
  college_hospital: string;
  category: string;
  user_detailscol: string;
  achievements: string;
  bio_details: string;
  created_at: string;
}

export default function UserDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`/api/userdetails?user_id=${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch user details');
        setUser(data);
      } catch (err) {
        console.error('Error fetching user details:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetails();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getFullName = (u: UserDetails) => {
    const prefix = u.prefix?.trim();
    const other = u.other_prefix?.trim();

    if (prefix?.toLowerCase() === 'other' && other)
      return `${other} ${u.firstname} ${u.lastname}`.trim();

    if (prefix && prefix.toLowerCase() !== 'other')
      return `${prefix} ${u.firstname} ${u.lastname}`.trim();

    if (!prefix && other)
      return `${other} ${u.firstname} ${u.lastname}`.trim();

    return `${u.firstname} ${u.lastname}`.trim();
  };

  const fields = user
    ? [
        { label: 'Full Name', value: getFullName(user), icon: <User className="w-4 h-4 text-blue-600" /> },
        { label: 'Designation', value: user.designation, icon: <Briefcase className="w-4 h-4 text-gray-700" /> },
        { label: 'Specialization', value: user.specialization, icon: <FileText className="w-4 h-4 text-gray-700" /> },
        { label: 'Phone Number', value: user.phonenumber, icon: <Phone className="w-4 h-4 text-green-600" /> },
        { label: 'Qualification', value: user.qualification, icon: <GraduationCap className="w-4 h-4 text-indigo-600" /> },
        { label: 'College / Hospital', value: user.college_hospital, icon: <Building2 className="w-4 h-4 text-gray-700" /> },
        { label: 'Category', value: user.category, icon: <Layers className="w-4 h-4 text-teal-600" /> },
        { label: 'State', value: user.state, icon: <Globe className="w-4 h-4 text-blue-500" /> },
        { label: 'Nationality', value: user.nationality, icon: <Flag className="w-4 h-4 text-red-500" /> },
        { label: 'Address', value: user.address, icon: <MapPin className="w-4 h-4 text-red-600" /> },
        { label: 'User Details', value: user.user_detailscol, icon: <FileText className="w-4 h-4 text-gray-600" /> },
        { label: 'Achievements', value: user.achievements, icon: <Trophy className="w-4 h-4 text-yellow-600" />, html: true },
        { label: 'Bio Details', value: user.bio_details, icon: <BookOpen className="w-4 h-4 text-purple-600" />, html: true },
        { label: 'Created At', value: formatDate(user.created_at), icon: <Calendar className="w-4 h-4 text-gray-600" /> },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Page Header */}
      <div className="px-6 py-4 mb-19 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray">
        <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
        <nav className="text-sm text-gray-500 mt-2 sm:mt-0">
          <a href="/admin/users" className="hover:underline hover:text-blue-600 transition-colors">
            Users
          </a>
          {' / '}
          <span className="text-gray-700 font-medium">User Details</span>
        </nav>
      </div>

      {/* Back Button under breadcrumb */}
      {user && (
        <div className="px-6 mb-1 flex justify-end">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-3 py-1 text-sm text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 hover:text-blue-600 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center text-gray-500">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              Loading user details...
            </div>
          ) : !user ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <p className="text-lg font-medium text-gray-600 mb-4">No user details found.</p>
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center gap-2 mx-auto px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Go Back
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* User Header Card */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">{getFullName(user)}</h1>
                    <p className="text-blue-100 text-sm mt-1">{user.designation || 'No designation specified'}</p>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {fields.map((field, i) => {
                    if (!field.value || !String(field.value).trim()) return null;
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-3 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-4 hover:shadow-md transition-all"
                      >
                        <div className="flex-shrink-0 mt-1 p-2 bg-white rounded-lg">{field.icon}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs uppercase text-gray-500 font-semibold tracking-wide">{field.label}</p>
                          {field.html ? (
                            <div
                              className="text-sm text-gray-800 mt-2 prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{ __html: field.value }}
                            />
                          ) : (
                            <p className="text-sm text-gray-800 mt-2 whitespace-pre-wrap break-words">{field.value}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}