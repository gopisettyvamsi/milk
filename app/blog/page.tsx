"use client";
import PageMetadata from '@/components/PageMetaData';
import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Search, Filter, Calendar, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import NavigationMenu from '@/components/NavigationMenu';
import Footer from '@/components/Footer';
import Image from 'next/image';
import DOMPurify from "dompurify";
import ScrollToTopButton from '@/components/buttons/ScrollToTopButton';
import BlogComments from '@/components/blog-comments-module';
import TopContactStrip from '@/components/TopContactStrip';

interface BlogPost {
  id: string;
  blog_title: string;
  slug: string;
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

const Blog = () => {
  const router = useRouter();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [allBlogPosts, setAllBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 10,
    total: 0
  });

  const stripHtmlTags = (html: string) =>
    DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });

  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search,
        category: selectedCategory !== 'all' ? selectedCategory : ''
      });

      const response = await fetch(`/api/blogs?${params}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        let filteredData = data;
        setAllBlogPosts(filteredData);
        const startIndex = (pagination.page - 1) * pagination.limit;
        const endIndex = startIndex + pagination.limit;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        setBlogPosts(paginatedData.reverse());
        setPagination(prev => ({
          ...prev,
          total: filteredData.length
        }));
      } else if (data.success && Array.isArray(data.data)) {
        setBlogPosts(data.data.reverse());
        setPagination(prev => ({
          ...prev,
          total: data.pagination?.total || data.data.length
        }));
      } else {
        console.error("Unexpected API response format:", data);
        setBlogPosts([]);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, search, selectedCategory]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchBlogs();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [fetchBlogs]);

  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [search, selectedCategory]);

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'auto' }); // ← Instant scroll
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const startIndex = (pagination.page - 1) * pagination.limit;
  const endIndex = startIndex + pagination.limit;

  return (
    <>
      <TopContactStrip />
      <NavigationMenu />
      <PageMetadata
        title="Blog - Edvenswa Enterprises Website"
        description="Edvenswa Enterprises"
        keywords="Edvenswa Enterprises Software solutions, artificial intelligence, machine learning, business transformation, Edvenswa, AI consulting, enterprise AI"
        ogUrl="/"
        canonicalUrl="/"
      />
      <div className="min-h-screen">
        <section className="pt-8 pb-2">
          <div className="container mx-auto px-2 sm:px-4">
            {/* Enhanced Header */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center mb-12"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-block mb-4"
              />

              <h1 className="text-2xl md:text-5xl font-bold pb-3 leading-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Our Blogs
              </h1>

              <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Ayurveda & Women's Health: Insights for Every Stage of Life
              </p>

              {!isLoading && blogPosts.length > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 text-sm font-medium text-gray-500"
                >
                  {pagination.total} {pagination.total === 1 ? 'Blog' : 'Blogs'} Available
                </motion.p>
              )}
            </motion.div>



            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="relative">
                  <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200"></div>
                  <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-600 absolute top-0 left-0"></div>
                </div>
                <p className="text-gray-500 text-lg mt-6 font-medium">Loading blogs...</p>
              </div>
            ) : blogPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-32"
              >
                <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto">
                  <BookOpen className="w-24 h-24 mx-auto text-gray-300 mb-6" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">No blogs found</h3>

                </div>
              </motion.div>
            ) : (
              <>
                {/* Blog Grid */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={pagination.page}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 will-change-opacity"
                  >
                    {blogPosts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08, duration: 0.5 }}
                        onClick={() => router.push(`/blog/${post.slug}`)}
                        className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                      >
                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 rounded-3xl"></div>

                        {/* Image Container */}
                        <div className="relative w-full h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                          {post.blog_image?.trim() ? (
                            <>
                              <img
                                src={post.blog_image}
                                alt={post.blog_title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                            </>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100">
                              <BookOpen className="w-20 h-20 mb-3 opacity-50" />
                              <span className="text-sm font-medium">No Preview</span>
                            </div>
                          )}

                          {/* Category Badge */}
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.08 + 0.3, type: "spring" }}
                            className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/50"
                          >
                            <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              {post.blog_cateogry}
                            </span>
                          </motion.div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <div className="mb-4">
                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300 line-clamp-2 mb-3">
                              {post.blog_title}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-3">
                              {stripHtmlTags(post.blog_content).split(" ").slice(0, 20).join(" ")}...
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span className="font-medium">
                                {new Date(post.created_at).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/blog/${post.slug}`);
                              }}
                              className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                            >
                              Read More
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Enhanced Pagination */}
                {totalPages > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col items-center gap-6"
                  >
                    {/* Page Navigation */}
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${pagination.page === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white shadow-md hover:shadow-xl hover:scale-105'
                          }`}
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Previous</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                          const showPage =
                            page === 1 ||
                            page === totalPages ||
                            (page >= pagination.page - 1 && page <= pagination.page + 1);

                          const showEllipsis =
                            (page === pagination.page - 2 && pagination.page > 3) ||
                            (page === pagination.page + 2 && pagination.page < totalPages - 2);

                          if (showEllipsis) {
                            return (
                              <span key={page} className="px-2 text-gray-400 font-bold">
                                ⋯
                              </span>
                            );
                          }

                          if (!showPage) return null;

                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`w-11 h-11 rounded-xl font-bold transition-all duration-300 ${pagination.page === page
                                ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl scale-110'
                                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg hover:scale-105'
                                }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === totalPages}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${pagination.page === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white shadow-md hover:shadow-xl hover:scale-105'
                          }`}
                      >
                        <span className="hidden sm:inline">Next</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Page Info Card */}
                    <div className="bg-white rounded-2xl shadow-lg px-6 py-4 border border-gray-100">
                      <p className="text-sm text-gray-600">
                        Showing{" "}
                        <span className="font-bold text-blue-600">
                          {blogPosts.length === 0 ? 0 : startIndex + 1}
                        </span>
                        {" "}-{" "}
                        <span className="font-bold text-blue-600">
                          {Math.min(endIndex, pagination.total)}
                        </span>
                        {" "}of{" "}
                        <span className="font-bold text-purple-600">{pagination.total}</span>
                        {" "}blogs
                      </p>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default Blog;