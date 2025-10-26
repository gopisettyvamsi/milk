
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  UserCircle,
  Edit,
  Trash2,
  Search,
  Filter,
  X,
  ChevronDown,
  Plus,
  AlertCircle,
  CheckCircle,
  Eye,
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: number;
  last_login: string;
  created_at: string;
}

interface UserFormData {
  name: string;
  email: string;
  role: string;
  is_active: number;
  password?: string;
  created_at?: string;
}

interface PaginationParams {
  page: number;
  limit: number;
  total: number;
}

interface ModalProps {
  type: 'success' | 'error' | 'confirm';
  title: string;
  message: string;
  onConfirm?: () => void;
  onClose: () => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  role?: string;

}

// Validation utilities
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateName = (name: string): string | null => {
  if (!name.trim()) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  if (name.trim().length > 50) return 'Name must not exceed 50 characters';
  if (!/^[a-zA-Z\s'-]+$/.test(name)) return 'Name can only contain letters, spaces, hyphens, and apostrophes';
  return null;
};

const validateEmail_validation = (email: string): string | null => {
  if (!email.trim()) return 'Email is required';
  if (email.trim().length > 100) return 'Email must not exceed 100 characters';
  if (!validateEmail(email)) return 'Please enter a valid email address';
  return null;
};

const validatePassword = (password: string, isEdit: boolean): string | null => {
  // if (!isEdit && !password) return 'Password is required for new users';
  // if (password && password.length < 6) return 'Password must be at least 6 characters';
  // if (password && password.length > 50) return 'Password must not exceed 50 characters';
  return null;
};

const Modal = ({ type, title, message, onConfirm, onClose }: ModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
        <div className="flex items-start gap-4">
          {type === 'success' && (
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
          )}
          {type === 'error' && (
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
          )}
          {type === 'confirm' && (
            <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
          )}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          {type === 'confirm' ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm?.();
                  onClose();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium"
              >
                Delete
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const UserFormModal = ({
  isOpen,
  user,
  formData,
  onSubmit,
  onChange,
  onClose,
}: {
  isOpen: boolean;
  user: User | null;
  formData: UserFormData;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: string, value: any) => void;
  onClose: () => void;
}) => {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;

    const emailError = validateEmail_validation(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password || '', !!user);
    if (passwordError) newErrors.password = passwordError;

    if (!formData.role) newErrors.role = 'Role is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
      setErrors({});
    }
  };

  const handleChange = async (field: string, value: any) => {
    onChange(field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));

    // 🔹 Real-time duplicate email check
    if (field === "email" && value.trim()) {
      const emailError = validateEmail_validation(value);
      if (emailError) {
        setErrors((prev) => ({ ...prev, email: emailError }));
        return;
      }

      try {
        const res = await fetch(`/api/users/check-email?email=${encodeURIComponent(value.trim())}`);
        const data = await res.json();

        if (data.exists) {
          setErrors((prev) => ({
            ...prev,
            email: "This email is already registered. Please use another email.",
          }));
        }
      } catch (err) {
        console.error("Email check failed:", err);
      }
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            {user ? 'Edit User' : 'Add New User'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter user name"
              className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:border-transparent transition-all ${errors.name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
                }`}
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              name="newUserEmail"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Enter email address"
              className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:border-transparent transition-all ${errors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
                }`}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Role *</label>
            <select
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:border-transparent transition-all ${errors.role
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
                }`}
            >
              <option value="">Select a role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.role}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password {user && '(Leave empty to keep current)'} *
            </label>
            <input
              type="password"
              value={formData.password || ''}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder={user ? 'Leave empty to keep current' : 'Enter password'}
              className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:border-transparent transition-all ${errors.password
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
                }`}
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active === 1}
                onChange={(e) => handleChange('is_active', e.target.checked ? 1 : 0)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-semibold text-gray-700">Active</span>
            </label>
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
            >
              {user ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'user',
    is_active: 1,
    password: '',

  });
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('active');
  const [isLoading, setIsLoading] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [alertModal, setAlertModal] = useState<ModalProps | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());

      if (search.trim()) {
        params.append('search', search.trim());
      }

      if (selectedRole !== 'all') {
        params.append('role', selectedRole);
      }

      if (selectedStatus !== 'all') {
        const statusValue = selectedStatus === 'active' ? '1' : '0';
        params.append('is_active', statusValue);
      }

      const response = await fetch(`/api/users?${params}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setUsers(data.data || []);
        setPagination((prev) => ({
          ...prev,
          total: data.pagination?.total || 0,
        }));
      } else {
        throw new Error(data.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setAlertModal({
        type: 'error',
        title: 'Error Loading Users',
        message: 'Failed to load users. Please try again.',
        onClose: () => setAlertModal(null),
      });
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, search, selectedRole, selectedStatus]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [fetchUsers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/api/users';
      const method = selectedUser ? 'PUT' : 'POST';
      const body = selectedUser
        ? {
          ...formData,
          id: selectedUser.id,
          ...(formData.password ? { password: formData.password } : {}),
        }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        setShowModal(false);
        resetForm();
        setPagination((prev) => ({ ...prev, page: 1 }));

        const action = selectedUser ? 'updated' : 'created';
        setAlertModal({
          type: 'success',
          title: 'Success!',
          message: `User ${action} successfully.`,
          onClose: () => {
            setAlertModal(null);
            fetchUsers();
          },
        });
      } else {
        throw new Error(responseData.message || `Failed to ${selectedUser ? 'update' : 'create'} user`);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      setAlertModal({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to save user. Please try again.',
        onClose: () => setAlertModal(null),
      });
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
      password: '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    setAlertModal({
      type: 'confirm',
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this user? This action cannot be undone.',
      onConfirm: async () => {
        try {
          const response = await fetch('/api/users', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
          });

          const responseData = await response.json();

          if (response.ok && responseData.success) {
            setPagination((prev) => ({ ...prev, page: 1 }));
            setAlertModal({
              type: 'success',
              title: 'Success!',
              message: 'User deleted successfully.',
              onClose: () => {
                setAlertModal(null);
                fetchUsers();
              },
            });
          } else {
            throw new Error(responseData.message || 'Failed to delete user');
          }
        } catch (error) {
          console.error('Error deleting user:', error);
          setAlertModal({
            type: 'error',
            title: 'Error',
            message: error instanceof Error ? error.message : 'Failed to delete user. Please try again.',
            onClose: () => setAlertModal(null),
          });
        }
      },
      onClose: () => setAlertModal(null),
    });
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'user',
      is_active: 1,
      password: '',
    });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages)
      setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedRole('all');
    setSelectedStatus('all');
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const activeFiltersCount = [
    search ? 1 : 0,
    selectedRole !== 'all' ? 1 : 0,
    selectedStatus !== 'all' ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    // Old code
    // <>
    //   {alertModal && <Modal {...alertModal} />}

    //   {/* Header */}
    //   <div className="px-6 py-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
    //     <h2 className="text-2xl font-bold text-gray-800"> Web Users</h2>
    //     <nav className="text-sm text-gray-500 mt-2 sm:mt-0">
    //       <a
    //         href="/admin/dashboard"
    //         className="hover:underline hover:text-blue-600 transition-colors"
    //       >
    //         Home
    //       </a>
    //       {' / '}
    //       <span className="text-gray-700 font-medium">Web Users</span>
    //     </nav>
    //   </div>

    //   <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-lg">
    //     {/* Add User Button */}
    //     <div className="w-full flex justify-end items-center gap-3 mb-6">
    //       <button
    //         onClick={() => {
    //           resetForm();
    //           setShowModal(true);
    //         }}
    //         className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
    //       >
    //         <Plus className="w-4 h-4" />
    //         <span className="font-medium">Add User</span>
    //       </button>
    //     </div>

    //     {/* Filters Section */}
    //     <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
    //       <button
    //         onClick={() => setFiltersExpanded(!filtersExpanded)}
    //         className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-gray-100 hover:to-blue-100 transition-colors"
    //       >
    //         <div className="flex items-center gap-3">
    //           <Filter className="w-5 h-5 text-blue-600" />
    //           <h3 className="font-semibold text-gray-800">Filters</h3>
    //           {activeFiltersCount > 0 && (
    //             <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
    //               {activeFiltersCount}
    //             </span>
    //           )}
    //         </div>
    //         <div className="flex items-center gap-3">
    //           {activeFiltersCount > 0 && (
    //             <button
    //               onClick={(e) => {
    //                 e.stopPropagation();
    //                 clearFilters();
    //               }}
    //               className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium"
    //             >
    //               <X className="w-4 h-4" /> Clear All
    //             </button>
    //           )}
    //           <ChevronDown
    //             className={`w-5 h-5 text-gray-500 transition-transform ${filtersExpanded ? 'rotate-180' : ''
    //               }`}
    //           />
    //         </div>
    //       </button>

    //       {filtersExpanded && (
    //         <div className="p-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
    //           <div>
    //             <label className="block text-sm font-semibold text-gray-700 mb-2">
    //               Search by Name
    //             </label>
    //             <div className="relative">
    //               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
    //               <input
    //                 type="text"
    //                 value={search}
    //                 onChange={(e) => handleSearchChange(e.target.value)}
    //                 placeholder="Enter user name..."
    //                 className="pl-10 pr-4 h-11 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    //               />
    //               {search && (
    //                 <button
    //                   onClick={() => handleSearchChange('')}
    //                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
    //                 >
    //                   <X className="w-4 h-4" />
    //                 </button>
    //               )}
    //             </div>
    //           </div>

    //           <div>
    //             <label className="block text-sm font-semibold text-gray-700 mb-2">
    //               Filter by Role
    //             </label>
    //             <select
    //               value={selectedRole}
    //               onChange={(e) => handleRoleChange(e.target.value)}
    //               className="w-full h-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4"
    //             >
    //               <option value="all">All Roles</option>
    //               <option value="admin">Admin</option>
    //               <option value="user">User</option>
    //             </select>
    //           </div>

    //           <div>
    //             <label className="block text-sm font-semibold text-gray-700 mb-2">
    //               Filter by Status
    //             </label>
    //             <select
    //               value={selectedStatus}
    //               onChange={(e) => handleStatusChange(e.target.value)}
    //               className="w-full h-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4"
    //             >
    //               <option value="all">All</option>
    //               <option value="active">Active</option>
    //               <option value="inactive">Inactive</option>
    //             </select>
    //           </div>
    //         </div>
    //       )}
    //     </div>

    //     {/* Users Table */}
    //     <div className="bg-white rounded-xl shadow-lg overflow-hidden">
    //       {isLoading ? (
    //         <div className="p-12 text-center text-gray-500">
    //           <div className="inline-block">
    //             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    //           </div>
    //           <p className="mt-3">Loading users...</p>
    //         </div>
    //       ) : users.length === 0 ? (
    //         <div className="p-12 text-center text-gray-500">No users found</div>
    //       ) : (
    //         <div className="overflow-x-auto">
    //           <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden shadow-sm">
    //             <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
    //               <tr>
    //                 <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-700 uppercase tracking-wider">
    //                   User
    //                 </th>
    //                 <th className="px-4 py-3 text-center text-[11px] font-bold text-gray-700 uppercase tracking-wider">
    //                   Role
    //                 </th>
    //                 <th className="px-4 py-3 text-center text-[11px] font-bold text-gray-700 uppercase tracking-wider">
    //                   Status
    //                 </th>
    //                 <th className="px-4 py-3 text-center text-[11px] font-bold text-gray-700 uppercase tracking-wider">
    //                   Registered Date
    //                 </th>
    //                 <th className="px-4 py-3 text-center text-[11px] font-bold text-gray-700 uppercase tracking-wider">
    //                   Actions
    //                 </th>
    //               </tr>
    //             </thead>

    //             <tbody className="bg-white divide-y divide-gray-100">
    //               {users.map((user) => (
    //                 <tr
    //                   key={user.id}
    //                   className="hover:bg-blue-50/70 transition-all duration-200"
    //                 >
    //                   {/* User Info */}
    //                   <td className="px-4 py-3">
    //                     <div className="flex items-center gap-2">
    //                       <UserCircle className="w-7 h-7 text-gray-400" />
    //                       <div>
    //                         <div className="text-sm font-semibold text-gray-900">
    //                           {user.name}
    //                         </div>
    //                         <div className="text-xs text-gray-500">{user.email}</div>
    //                       </div>
    //                     </div>
    //                   </td>

    //                   {/* Role */}
    //                   <td className="px-4 py-3 text-center text-sm text-gray-700 capitalize">
    //                     {user.role}
    //                   </td>

    //                   {/* Status */}
    //                   <td className="px-4 py-3 text-center text-sm">
    //                     <span
    //                       className={`px-2.5 py-1 text-[11px] font-semibold rounded-full ${user.is_active
    //                           ? "bg-green-100 text-green-700"
    //                           : "bg-red-100 text-red-700"
    //                         }`}
    //                     >
    //                       {user.is_active ? "Active" : "Inactive"}
    //                     </span>
    //                   </td>

    //                   {/* Registered Date */}
    //                   <td className="px-4 py-3 text-center text-sm text-gray-700">
    //                     {user.created_at
    //                       ? (() => {
    //                         const date = new Date(user.created_at);
    //                         const day = String(date.getDate()).padStart(2, "0");
    //                         const month = String(date.getMonth() + 1).padStart(2, "0");
    //                         const year = date.getFullYear();
    //                         return `${day}/${month}/${year}`;
    //                       })()
    //                       : "N/A"}
    //                   </td>


    //                   {/* Actions */}
    //                   <td className="px-4 py-3 text-center">
    //                     <div className="flex justify-center items-center gap-1.5">
    //                       {/* View */}
    //                       <div className="relative group">
    //                         <button
    //                           onClick={() => window.location.href = `/admin/userdetails/${user.id}`}
    //                           className="w-14 h-6 flex items-center justify-center gap-1 bg-gray-600 text-white rounded-sm hover:bg-gray-700 transition-all text-[10px] font-medium shadow-sm hover:shadow-md"
    //                         >
    //                           <Eye className="w-3 h-3" />
    //                           <span>View</span>
    //                         </button>

    //                         {/* <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
    //             View Details
    //           </span> */}
    //                       </div>

    //                       {/* Edit */}
    //                       <button
    //                         onClick={() => handleEdit(user)}
    //                         className="w-14 h-6 flex items-center justify-center gap-1 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-all text-[10px] font-medium shadow-sm hover:shadow-md"
    //                       >
    //                         Edit
    //                       </button>

    //                       {/* Delete */}
    //                       <button
    //                         onClick={() => handleDelete(user.id)}
    //                         className="w-14 h-6 flex items-center justify-center gap-1 bg-red-600 text-white rounded-sm hover:bg-red-700 transition-all text-[10px] font-medium shadow-sm hover:shadow-md"
    //                       >
    //                         Delete
    //                       </button>
    //                     </div>
    //                   </td>
    //                 </tr>
    //               ))}
    //             </tbody>
    //           </table>

    //         </div>
    //       )}
    //     </div>

    //     {/* Pagination */}
    //     <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
    //       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
    //         <div className="text-sm text-gray-700">
    //           Showing{' '}
    //           <span className="font-bold text-gray-900">
    //             {pagination.total === 0
    //               ? 0
    //               : (pagination.page - 1) * pagination.limit + 1}
    //           </span>{' '}
    //           to{' '}
    //           <span className="font-bold text-gray-900">
    //             {Math.min(pagination.page * pagination.limit, pagination.total)}
    //           </span>{' '}
    //           of <span className="font-bold text-gray-900">{pagination.total}</span>{' '}
    //           results
    //         </div>
    //         <div className="flex items-center justify-center gap-2">
    //           <button
    //             onClick={() => handlePageChange(pagination.page - 1)}
    //             disabled={pagination.page === 1}
    //             className="px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 hover:bg-gray-50 transition-all font-medium text-sm shadow-sm"
    //           >
    //             Previous
    //           </button>
    //           {[...Array(totalPages)].map((_, i) => {
    //             const pageNum = i + 1;
    //             if (
    //               pageNum === 1 ||
    //               pageNum === totalPages ||
    //               (pageNum >= pagination.page - 2 &&
    //                 pageNum <= pagination.page + 2)
    //             ) {
    //               return (
    //                 <button
    //                   key={pageNum}
    //                   onClick={() => handlePageChange(pageNum)}
    //                   className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${pagination.page === pageNum
    //                       ? 'bg-blue-600 text-white shadow-md'
    //                       : 'border border-gray-300 bg-white hover:bg-gray-50'
    //                     }`}
    //                 >
    //                   {pageNum}
    //                 </button>
    //               );
    //             }
    //             if (
    //               pageNum === pagination.page - 3 ||
    //               pageNum === pagination.page + 3
    //             )
    //               return (
    //                 <span key={pageNum} className="text-gray-400 px-2">
    //                   ...
    //                 </span>
    //               );
    //             return null;
    //           })}
    //           <button
    //             onClick={() => handlePageChange(pagination.page + 1)}
    //             disabled={pagination.page === totalPages}
    //             className="px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 hover:bg-gray-50 transition-all font-medium text-sm shadow-sm"
    //           >
    //             Next
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    //   <UserFormModal
    //     isOpen={showModal}
    //     user={selectedUser}
    //     formData={formData}
    //     onSubmit={handleSubmit}
    //     onChange={handleFormChange}
    //     onClose={() => {
    //       setShowModal(false);
    //       resetForm();
    //     }}
    //   />
    //   {alertModal && <Modal {...alertModal} />}
    // </>

    // New Code
    <>
    {alertModal && <Modal {...alertModal} />}

    {/* Header - Remains consistent */}
    <div className="px-6 py-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-800"> Web Users</h2>
        <nav className="text-sm text-gray-500 mt-2 sm:mt-0">
            <a
                href="/admin/dashboard"
                className="hover:underline hover:text-blue-600 transition-colors"
            >
                Home
            </a>
            {' / '}
            <span className="text-gray-700 font-medium">Web Users</span>
        </nav>
    </div>

    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-lg">
        {/* Add User Button - Remains consistent */}
        <div className="w-full flex justify-end items-center gap-3 mb-6">
            <button
                onClick={() => {
                    resetForm();
                    setShowModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
            >
                <Plus className="w-4 h-4" />
                <span className="font-medium">Add User</span>
            </button>
        </div>

        {/* Filters Section - Remains consistent, responsive grid is fine */}
        {/* ... (Filters Section code remains unchanged) ... */}
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
            <button
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-gray-100 hover:to-blue-100 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <Filter className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-800">Filters</h3>
                    {activeFiltersCount > 0 && (
                        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {activeFiltersCount}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {activeFiltersCount > 0 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                clearFilters();
                            }}
                            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                            <X className="w-4 h-4" /> Clear All
                        </button>
                    )}
                    <ChevronDown
                        className={`w-5 h-5 text-gray-500 transition-transform ${filtersExpanded ? 'rotate-180' : ''
                            }`}
                    />
                </div>
            </button>

            {filtersExpanded && (
                <div className="p-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Search by Name
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                placeholder="Enter user name..."
                                className="pl-10 pr-4 h-11 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {search && (
                                <button
                                    onClick={() => handleSearchChange('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Filter by Role
                        </label>
                        <select
                            value={selectedRole}
                            onChange={(e) => handleRoleChange(e.target.value)}
                            className="w-full h-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Filter by Status
                        </label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="w-full h-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4"
                        >
                            <option value="all">All</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            )}
        </div>
        {/* END Filters Section */}

        {/* Users Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {isLoading ? (
                <div className="p-12 text-center text-gray-500">
                    <div className="inline-block">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="mt-3">Loading users...</p>
                </div>
            ) : users.length === 0 ? (
                <div className="text-center text-gray-500">No users found</div>
            ) : (
                <>
                    {/* ---------------------------------- */}
                    {/* 1. DESKTOP / TABLET VIEW (TABLE) */}
                    {/* Hidden on mobile (default) and shown from 'sm' breakpoint up */}
                    {/* ---------------------------------- */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                            <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-700 uppercase tracking-wider min-w-[150px]">
                                        User
                                    </th>
                                    <th className="px-4 py-3 text-center text-[11px] font-bold text-gray-700 uppercase tracking-wider min-w-[80px]">
                                        Role
                                    </th>
                                    <th className="px-4 py-3 text-center text-[11px] font-bold text-gray-700 uppercase tracking-wider min-w-[80px]">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-center text-[11px] font-bold text-gray-700 uppercase tracking-wider min-w-[120px]">
                                        Registered Date
                                    </th>
                                    <th className="px-4 py-3 text-center text-[11px] font-bold text-gray-700 uppercase tracking-wider min-w-[150px]">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-100 ">
                                {users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-blue-50/70 transition-all duration-200"
                                    >
                                        {/* User Info */}
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <UserCircle className="w-7 h-7 text-gray-400 flex-shrink-0" />
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Role */}
                                        <td className="px-4 py-3 text-center text-sm text-gray-700 capitalize whitespace-nowrap">
                                            {user.role}
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3 text-center text-sm whitespace-nowrap">
                                            <span
                                                className={`px-2.5 py-1 text-[11px] font-semibold rounded-full ${user.is_active
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {user.is_active ? "Active" : "Inactive"}
                                            </span>
                                        </td>

                                        {/* Registered Date */}
                                        <td className="px-4 py-3 text-center text-sm text-gray-700 whitespace-nowrap">
                                            {user.created_at
                                                ? (() => {
                                                    const date = new Date(user.created_at);
                                                    const day = String(date.getDate()).padStart(2, "0");
                                                    const month = String(date.getMonth() + 1).padStart(2, "0");
                                                    const year = date.getFullYear();
                                                    return `${day}/${month}/${year}`;
                                                })()
                                                : "N/A"}
                                        </td>


                                        {/* Actions */}
                                        <td className="px-4 py-3 text-center whitespace-nowrap">
                                            <div className="flex justify-center items-center gap-1.5">
                                                {/* View */}
                                                <button
                                                    onClick={() => window.location.href = `/admin/userdetails/${user.id}`}
                                                    className="w-14 h-6 flex items-center justify-center gap-1 bg-gray-600 text-white rounded-sm hover:bg-gray-700 transition-all text-[10px] font-medium shadow-sm hover:shadow-md"
                                                >
                                                    <Eye className="w-3 h-3" />
                                                    <span>View</span>
                                                </button>

                                                {/* Edit */}
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="w-14 h-6 flex items-center justify-center gap-1 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-all text-[10px] font-medium shadow-sm hover:shadow-md"
                                                >
                                                    Edit
                                                </button>

                                                {/* Delete */}
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="w-14 h-6 flex items-center justify-center gap-1 bg-red-600 text-white rounded-sm hover:bg-red-700 transition-all text-[10px] font-medium shadow-sm hover:shadow-md"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="sm:hidden p-4 space-y-4 divide-y divide-gray-200 gap-2">
                        {users.map((user) => (
                            <div key={user.id} className="pt-4 bg-white hover:bg-blue-50/70 transition-all duration-200 rounded-lg">
                                {/* Top Section: User Info & Status */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <UserCircle className="w-8 h-8 text-gray-400 flex-shrink-0" />
                                        <div>
                                            <div className="text-base font-semibold text-gray-900">
                                                {user.name}
                                            </div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                    <span
                                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-full flex-shrink-0 ${user.is_active
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {user.is_active ? "Active" : "Inactive"}
                                    </span>
                                </div>

                                {/* Details Section */}
                                <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700 border-t border-gray-100 pt-3">
                                    <div>
                                        <span className="font-medium text-gray-500">Role:</span>
                                        <span className="ml-2 capitalize">{user.role}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-medium text-gray-500">Joined:</span>
                                        <span className="ml-2">
                                            {user.created_at
                                                ? (() => {
                                                    const date = new Date(user.created_at);
                                                    const day = String(date.getDate()).padStart(2, "0");
                                                    const month = String(date.getMonth() + 1).padStart(2, "0");
                                                    const year = date.getFullYear();
                                                    return `${day}/${month}/${year}`;
                                                })()
                                                : "N/A"}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions Section */}
                                <div className="flex justify-end gap-2 mt-4 pb-2">
                                    <button
                                        onClick={() => window.location.href = `/admin/userdetails/${user.id}`}
                                        className="w-14 h-6 flex items-center justify-center gap-1 bg-gray-600 text-white rounded-sm hover:bg-gray-700 transition-all text-[10px] font-medium shadow-sm hover:shadow-md"
                                    >
                                        <Eye className="w-3 h-3" />
                                        <span>View</span>
                                    </button>
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="w-14 h-6 flex items-center justify-center gap-1 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-all text-[10px] font-medium shadow-sm hover:shadow-md"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="w-14 h-6 flex items-center justify-center gap-1 bg-red-600 text-white rounded-sm hover:bg-red-700 transition-all text-[10px] font-medium shadow-sm hover:shadow-md"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>

        {/* Pagination - Remains consistent, made slightly more mobile-friendly */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-bold text-gray-900">
                        {pagination.total === 0
                            ? 0
                            : (pagination.page - 1) * pagination.limit + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-bold text-gray-900">
                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>{' '}
                    of <span className="font-bold text-gray-900">{pagination.total}</span>{' '}
                    results
                </div>
                {/* Wrap pagination buttons to allow horizontal scroll if too many pages */}
                <div className="flex items-center justify-center gap-2 overflow-x-auto p-1">
                    <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 hover:bg-gray-50 transition-all font-medium text-sm shadow-sm flex-shrink-0"
                    >
                        Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        if (
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            (pageNum >= pagination.page - 2 &&
                                pageNum <= pagination.page + 2)
                        ) {
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex-shrink-0 ${pagination.page === pageNum
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'border border-gray-300 bg-white hover:bg-gray-50'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        }
                        if (
                            pageNum === pagination.page - 3 ||
                            pageNum === pagination.page + 3
                        )
                            return (
                                <span key={pageNum} className="text-gray-400 px-2 flex-shrink-0">
                                    ...
                                </span>
                            );
                        return null;
                    })}
                    <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === totalPages}
                        className="px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 hover:bg-gray-50 transition-all font-medium text-sm shadow-sm flex-shrink-0"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    </div>
    <UserFormModal
        isOpen={showModal}
        user={selectedUser}
        formData={formData}
        onSubmit={handleSubmit}
        onChange={handleFormChange}
        onClose={() => {
            setShowModal(false);
            resetForm();
        }}
    />
    {alertModal && <Modal {...alertModal} />}
    </>
  );
};

export default UsersPage;