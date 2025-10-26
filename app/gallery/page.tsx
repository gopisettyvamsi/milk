"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import NavigationMenu from "@/components/NavigationMenu";
import Footer from "@/components/Footer";
import TopContactStrip from "@/components/TopContactStrip";
import PageMetadata from "@/components/PageMetaData";
import { ChevronLeft, ChevronRight, Image as ImageIcon, Calendar, ArrowRight } from "lucide-react";

type Gallery = {
  id: number;
  slug: string;
  title: string;
  thumbnail_url: string | null;
  photo_count: number;
  created_at: string;
};

const ITEMS_PER_PAGE = 6;

export default function GalleryPage() {
  const router = useRouter();
  const [items, setItems] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      setItems(data || []);
      setLoading(false);
    })();
  }, []);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'auto' }); // ← Instant scroll
  };

  return (
    <>
      <TopContactStrip />
      <NavigationMenu />
      <PageMetadata title="Gallery" description="Explore our event galleries." />
      <section className="pt-8 pb-2">

        <div className="container mx-auto px-2 sm:px-4">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4"
            >
            </motion.div>

            <h1 className="text-2xl md:text-5xl font-bold  pb-3 leading-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Explore Our Gallery
            </h1>


            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Discover memorable moments captured through our lens
            </p>

            {!loading && items.length > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 text-sm font-medium text-gray-500"
              >
                {items.length} {items.length === 1 ? 'Gallery' : 'Galleries'} • {items.reduce((acc, g) => acc + g.photo_count, 0)} Photos
              </motion.p>
            )}
          </motion.div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="relative">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200"></div>
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-600 absolute top-0 left-0"></div>
              </div>
              <p className="text-gray-500 text-lg mt-6 font-medium">Loading galleries...</p>
            </div>
          ) : items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-32"
            >
              <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto">
                <ImageIcon className="w-24 h-24 mx-auto text-gray-300 mb-6" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No galleries yet</h3>
                <p className="text-gray-500">Check back soon for new content!</p>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Enhanced Gallery Grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 will-change-opacity"
                >
                  {currentItems.map((g, i) => (
                    <motion.div
                      key={g.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.5 }}
                      onClick={() => router.push(`/gallery/${g.slug}`)}
                      className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                    >
                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 rounded-3xl"></div>

                      {/* Image Container */}
                      <div className="relative w-full h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                        {g.thumbnail_url ? (
                          <>
                            <img
                              src={g.thumbnail_url}
                              alt={g.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100">
                            <ImageIcon className="w-20 h-20 mb-3 opacity-50" />
                            <span className="text-sm font-medium">No Preview</span>
                          </div>
                        )}

                        {/* Photo Count Badge - Enhanced */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.08 + 0.3, type: "spring" }}
                          className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/50"
                        >
                          <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {g.photo_count} {g.photo_count === 1 ? 'photo' : 'photos'}
                          </span>
                        </motion.div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 via-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-8">
                          <div className="flex items-center gap-2 text-white font-semibold">
                            {/* <span
                              className="px-4 py-1.5 bg-white text-blue-600 font-semibold rounded-full shadow-md border border-gray-200 transition-all duration-150 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:text-white"
                            >
                              View Gallery
                            </span> */}


                          </div>
                        </div>
                      </div>

                      {/* Content - Enhanced */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xl font-bold text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300 line-clamp-2">
                            {g.title}
                          </h3>

                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // prevent parent click
                              router.push(`/gallery/${g.slug}`);
                            }}
                            className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                          >
                            View Gallery
                          </button>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">
                            {new Date(g.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
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
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white shadow-md hover:shadow-xl hover:scale-105'
                        }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Previous</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        const showPage =
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1);

                        const showEllipsis =
                          (page === currentPage - 2 && currentPage > 3) ||
                          (page === currentPage + 2 && currentPage < totalPages - 2);

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
                            onClick={() => goToPage(page)}
                            className={`w-11 h-11 rounded-xl font-bold transition-all duration-300 ${currentPage === page
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
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white shadow-md hover:shadow-xl hover:scale-105'
                        }`}
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Page Info Card */}
                  <div className="bg-white rounded-2xl shadow-lg px-6 py-4 border border-gray-100">
                    <p className="text-sm text-gray-600">
                      Showing{" "}
                      <span className="font-bold text-blue-600">
                        {items.length === 0 ? 0 : startIndex + 1}
                      </span>
                      {" "}-{" "}
                      <span className="font-bold text-blue-600">
                        {Math.min(endIndex, items.length)}
                      </span>
                      {" "}of{" "}
                      <span className="font-bold text-purple-600">{items.length}</span>
                      {" "}galleries
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Original Pagination (Alternative Style) */}
              {/* {totalPages > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-bold text-gray-900">
                        {items.length === 0 ? 0 : startIndex + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-bold text-gray-900">
                        {Math.min(endIndex, items.length)}
                      </span>{" "}
                      of{" "}
                      <span className="font-bold text-gray-900">{items.length}</span> results
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 hover:bg-gray-50 transition-all font-medium text-sm shadow-sm"
                      >
                        Previous
                      </button>
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        if (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => goToPage(pageNum)}
                              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${currentPage === pageNum
                                  ? "bg-blue-600 text-white shadow-md"
                                  : "border border-gray-300 bg-white hover:bg-gray-50"
                                }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                        if (pageNum === currentPage - 3 || pageNum === currentPage + 3)
                          return (
                            <span key={pageNum} className="text-gray-400 px-2">
                              ...
                            </span>
                          );
                        return null;
                      })}
                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 hover:bg-gray-50 transition-all font-medium text-sm shadow-sm"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )} */}
            </>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}