"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  X,
  Filter,
  ChevronDown,
  Image as ImageIcon,
  BookOpen,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";

/* ✅ Reusable Modal Component (same style as UsersPage) */
interface ModalProps {
  type: "confirm" | "success" | "error";
  title: string;
  message: string;
  onConfirm?: () => void;
  onClose: () => void;
}

const Modal = ({ type, title, message, onConfirm, onClose }: ModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
        <div className="flex items-start gap-4">
          {type === "success" && (
            <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
          )}
          {type === "error" && (
            <AlertCircle className="w-6 h-6 text-red-600 mt-1" />
          )}
          {type === "confirm" && (
            <AlertCircle className="w-6 h-6 text-orange-600 mt-1" />
          )}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          {type === "confirm" ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm?.();
                  onClose();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Delete
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface Blog {
  id: string;
  blog_title: string;
  blog_content: string;
  blog_image: string;
  blog_cateogry: string;
  created_at: string;
}

interface PaginationParams {
  page: number;
  limit: number;
  total: number;
}

const AdminBlogPanel = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [alertModal, setAlertModal] = useState<ModalProps | null>(null);
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 10,
    total: 0,
  });

  const stripHtml = (html: string): string => {
    const withoutTags = html.replace(/<[^>]+>/g, "");
    const textarea = document.createElement("textarea");
    textarea.innerHTML = withoutTags;
    return textarea.value;
  };

  const fetchBlogs = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) setRefreshing(true);
        else setIsLoading(true);

        const response = await fetch("/api/blogs");
        const data = await response.json();

        if (Array.isArray(data)) {
          let filteredData = data;

          // Search
          if (searchFilter) {
            filteredData = filteredData.filter(
              (blog) =>
                blog.blog_title.toLowerCase().includes(searchFilter.toLowerCase()) ||
                stripHtml(blog.blog_content).toLowerCase().includes(searchFilter.toLowerCase())
            );
          }

          // Category filter
          if (categoryFilter) {
            filteredData = filteredData.filter(
              (blog) => blog.blog_cateogry === categoryFilter
            );
          }

          setAllBlogs(filteredData);
          const startIndex = (pagination.page - 1) * pagination.limit;
          const endIndex = startIndex + pagination.limit;
          setBlogs(filteredData.slice(startIndex, endIndex));
          setPagination((prev) => ({ ...prev, total: filteredData.length }));
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    },
    [pagination.page, pagination.limit, searchFilter, categoryFilter]
  );

  useEffect(() => {
    const delay = setTimeout(() => fetchBlogs(), 300);
    return () => clearTimeout(delay);
  }, [searchFilter, categoryFilter, pagination.page, fetchBlogs]);

  /* ✅ Delete with confirmation popup */
  const handleDelete = (id: string) => {
    setAlertModal({
      type: "confirm",
      title: "Confirm Delete",
      message: "Are you sure you want to delete this blog? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
          if (response.ok) {
            setAlertModal({
              type: "success",
              title: "Deleted Successfully",
              message: "The blog post was deleted successfully.",
              onClose: () => {
                setAlertModal(null);
                fetchBlogs();
              },
            });
          } else {
            throw new Error("Failed to delete blog");
          }
        } catch (error) {
          setAlertModal({
            type: "error",
            title: "Error",
            message: "Failed to delete blog. Please try again.",
            onClose: () => setAlertModal(null),
          });
        }
      },
      onClose: () => setAlertModal(null),
    });
  };

  const clearFilters = () => {
    setSearchFilter("");
    setCategoryFilter("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const activeFiltersCount = [searchFilter, categoryFilter].filter(Boolean).length;
  const categories = [...new Set(allBlogs.map((b) => b.blog_cateogry))];

  return (
    <>
    {/* Desktop */}
    <div className="hidden md:block">
    <AdminLayout>
      {alertModal && <Modal {...alertModal} />}

      <div className="px-6 py-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Blog Posts</h2>
        <nav className="text-sm text-gray-500 mt-2 sm:mt-0">
          <a href="/admin/dashboard" className="hover:underline hover:text-blue-600 transition-colors">
            Home
          </a>{" "}
          / <span className="text-gray-700">Blog Posts</span>
        </nav>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="w-full flex justify-end items-center gap-3 mb-6">
            <button
              onClick={() => (window.location.href = "/Admin-blog-panel/add-blog")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">New Blog</span>
            </button>
          </div>

          {/* Filters */}
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
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform ${filtersExpanded ? "rotate-180" : ""}`}
              />
            </button>

            {filtersExpanded && (
              <div className="p-6 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Search Blogs
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="Search by title or content..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="pl-10 pr-4 h-11 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      {searchFilter && (
                        <button
                          onClick={() => setSearchFilter("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Filter by Category
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full h-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 transition-all"
                    >
                      <option value="">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Blog List */}
          {isLoading ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center text-gray-500">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              Loading blogs...
            </div>
          ) : blogs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No blogs found</p>
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your filters or create a new blog post
              </p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {blogs.map((blog, index) => (
                    <motion.div
                      key={blog.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-center justify-between p-6 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                          {blog.blog_image ? (
                            <img
                              src={blog.blog_image}
                              alt={blog.blog_title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon size={24} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-gray-900 mb-1">{blog.blog_title}</h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {stripHtml(blog.blog_content)}
                          </p>
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                            {blog.blog_cateogry}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() =>
                            (window.location.href = `/Admin-blog-panel/add-blog?id=${blog.id}`)
                          }
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium shadow-sm hover:shadow-md"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium shadow-sm hover:shadow-md"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Pagination */}
              <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-bold text-gray-900">
                      {pagination.total === 0
                        ? 0
                        : (pagination.page - 1) * pagination.limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-bold text-gray-900">
                      {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-gray-900">{pagination.total}</span> results
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 hover:bg-gray-50 transition-all font-medium text-sm shadow-sm"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= pagination.page - 2 && pageNum <= pagination.page + 2)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${pagination.page === pageNum
                                ? "bg-blue-600 text-white shadow-md"
                                : "border border-gray-300 bg-white hover:bg-gray-50"
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                      if (pageNum === pagination.page - 3 || pageNum === pagination.page + 3)
                        return (
                          <span key={pageNum} className="text-gray-400 px-2">
                            ...
                          </span>
                        );
                      return null;
                    })}
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === totalPages}
                      className="px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 hover:bg-gray-50 transition-all font-medium text-sm shadow-sm"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
    </div>
    {/* Mobile */}
    <div className="block md:hidden">
    <AdminLayout>
  <div className="px-6 py-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <h2 className="text-2xl font-bold text-gray-800">Blog Posts</h2>
    <nav className="text-sm text-gray-500 mt-2 sm:mt-0">
      <a href="/admin/dashboard" className="hover:underline hover:text-blue-600 transition-colors">
        Home
      </a>{" "}
      / <span className="text-gray-700">Blog Posts</span>
    </nav>
  </div>

  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="w-full flex justify-end items-center gap-3 mb-6">
        <button
          onClick={() => (window.location.href = "/Admin-blog-panel/add-blog")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">New Blog</span>
        </button>
      </div>

      {/* Filters */}
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
          <ChevronDown
            className={`w-5 h-5 text-gray-500 transition-transform ${filtersExpanded ? "rotate-180" : ""}`}
          />
        </button>

        {filtersExpanded && (
          <div className="p-6 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search Blogs</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search by title or content..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="pl-10 pr-4 h-11 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  {searchFilter && (
                    <button
                      onClick={() => setSearchFilter("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full h-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 transition-all"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Blog List */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center text-gray-500">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          Loading blogs...
        </div>
      ) : blogs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">No blogs found</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or create a new blog post</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row gap-4 hover:bg-blue-50 transition-colors"
              >
                {/* Blog Image */}
                <div className="w-full sm:w-24 h-40 sm:h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {blog.blog_image ? (
                    <img src={blog.blog_image} alt={blog.blog_title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={24} className="text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Blog Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{blog.blog_title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{stripHtml(blog.blog_content)}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {blog.blog_cateogry}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2 mt-3 sm:mt-0">
                    <button
                      onClick={() => (window.location.href = `/Admin-blog-panel/add-blog?id=${blog.id}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium shadow-sm hover:shadow-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium shadow-sm hover:shadow-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <div className="items-center justify-center gap-4 flex flex-col">
              <div className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-bold text-gray-900">
                  {pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-bold text-gray-900">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{" "}
                of{" "}
                <span className="font-bold text-gray-900">{pagination.total}</span> results
              </div>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 hover:bg-gray-50 transition-all font-medium text-sm shadow-sm"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= pagination.page - 2 && pageNum <= pagination.page + 2)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                          pagination.page === pageNum
                            ? "bg-blue-600 text-white shadow-md"
                            : "border border-gray-300 bg-white hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  if (pageNum === pagination.page - 3 || pageNum === pagination.page + 3)
                    return (
                      <span key={pageNum} className="text-gray-400 px-2">
                        ...
                      </span>
                    );
                  return null;
                })}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 hover:bg-gray-50 transition-all font-medium text-sm shadow-sm"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
</AdminLayout>
    </div>
    </>
  );
};

export default AdminBlogPanel;
