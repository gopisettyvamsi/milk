"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import NavigationMenu from "@/components/NavigationMenu";
import Footer from "@/components/Footer";
import TopContactStrip from "@/components/TopContactStrip";
import PageMetadata from "@/components/PageMetaData";
import { ChevronLeft, ChevronRight, ArrowLeft, Image as ImageIcon, X } from "lucide-react";

type Gallery = { id: number; title: string; slug: string; thumbnail_url: string | null; };
type Photo = { id: number; image_url: string; caption: string | null; };

const PHOTOS_PER_PAGE = 12;

export default function GalleryDetailPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const list = await fetch("/api/gallery").then(r => r.json());
      const g = (list as Gallery[]).find(x => x.slug === slug);
      if (!g) { setLoading(false); return; }
      setGallery(g);

      const ph = await fetch(`/api/gallery/${g.id}/images`).then(r => r.json());
      setPhotos(ph || []);
      setLoading(false);
    })();
  }, [slug]);

  const totalPages = Math.ceil(photos.length / PHOTOS_PER_PAGE);
  const startIndex = (currentPage - 1) * PHOTOS_PER_PAGE;
  const endIndex = startIndex + PHOTOS_PER_PAGE;
  const currentPhotos = photos.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openLightbox = (photo: Photo) => {
    setSelectedPhoto(photo);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = 'auto';
  };

  const navigatePhoto = (direction: 'prev' | 'next') => {
    if (!selectedPhoto) return;
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
    const newIndex = direction === 'prev' 
      ? (currentIndex - 1 + photos.length) % photos.length
      : (currentIndex + 1) % photos.length;
    setSelectedPhoto(photos[newIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigatePhoto('prev');
      if (e.key === 'ArrowRight') navigatePhoto('next');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, photos]);

  return (
    <>
      <TopContactStrip />
      <NavigationMenu />
      <PageMetadata title={gallery?.title || "Gallery"} description="Event photo collection" />

      <section className="pt-24 pb-16 bg-gradient-to-br from-gray-50 via-purple-50/20 to-pink-50/20 min-h-screen">
        <div className="container mx-auto px-2 sm:px-4">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-purple-600 font-medium transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Gallery
          </motion.button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent capitalize">
              {gallery?.title || (slug as string)?.toString().replace(/-/g, " ")}
            </h1>
            {photos.length > 0 && (
              <p className="text-gray-600 text-lg">
                {photos.length} {photos.length === 1 ? 'photo' : 'photos'} in this collection
              </p>
            )}
          </motion.div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mb-4"></div>
              <p className="text-gray-500 text-lg">Loading photos...</p>
            </div>
          ) : !gallery ? (
            <div className="text-center py-20">
              <ImageIcon className="w-20 h-20 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-xl mb-4">Gallery not found</p>
              <button
                onClick={() => router.push('/gallery')}
                className="text-blue-600 hover:text-purple-600 font-medium"
              >
                Return to galleries
              </button>
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center py-20">
              <ImageIcon className="w-20 h-20 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-xl">No photos yet in this gallery</p>
            </div>
          ) : (
            <>
              {/* Photos Grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12"
                >
                  {currentPhotos.map((p, index) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      onClick={() => openLightbox(p)}
                      className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer aspect-square bg-gradient-to-br from-gray-100 to-gray-200"
                    >
                      <img
                        src={p.image_url}
                        alt={p.caption || `Photo ${startIndex + index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                        {p.caption && (
                          <p className="text-white text-sm font-medium p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            {p.caption}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap items-center justify-center gap-2 mt-12"
                >
                  {/* Previous Button */}
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-purple-600 hover:text-white shadow-md hover:shadow-lg'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </button>

                  {/* Page Numbers */}
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
                          <span key={page} className="px-2 text-gray-400">
                            ...
                          </span>
                        );
                      }

                      if (!showPage) return null;

                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-110'
                              : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md hover:shadow-lg'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === totalPages
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-purple-600 hover:text-white shadow-md hover:shadow-lg'
                    }`}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </motion.div>
              )}

              {/* Page Info */}
              {totalPages > 1 && (
                <div className="text-center mt-6 text-gray-600">
                  Showing {startIndex + 1}-{Math.min(endIndex, photos.length)} of {photos.length} photos
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); navigatePhoto('prev'); }}
              className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); navigatePhoto('next'); }}
              className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
            >
              <ChevronRight className="w-10 h-10" />
            </button>

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl max-h-[90vh] flex flex-col"
            >
              <img
                src={selectedPhoto.image_url}
                alt={selectedPhoto.caption || "Photo"}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              {selectedPhoto.caption && (
                <p className="text-white text-center mt-4 text-lg">
                  {selectedPhoto.caption}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}