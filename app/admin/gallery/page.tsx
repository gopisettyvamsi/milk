"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Edit3, ImagePlus, X, AlertCircle, CheckCircle, Filter, ChevronDown, Search } from "lucide-react";
import { motion } from "framer-motion";

/* ✅ Reusable Modal Component */
interface ModalProps {
  type: "confirm" | "success" | "error";
  title: string;
  message: string;
  onConfirm?: () => void;
  onClose: () => void;
}

const Modal = ({ type, title, message, onConfirm, onClose }: ModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
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

type Gallery = {
  id: number;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  photo_count: number;
  created_at: string;
};

type Photo = {
  id: number;
  gallery_id: number;
  image_url: string;
  caption: string | null;
  created_at: string;
};

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export default function AdminGalleryPanel() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [filteredGalleries, setFilteredGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Gallery | null>(null);
  const [alertModal, setAlertModal] = useState<ModalProps | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);

  const [searchFilter, setSearchFilter] = useState("");
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const fetchGalleries = async () => {
    setLoading(true);
    const res = await fetch("/api/gallery");
    const data = await res.json();
    setGalleries(data || []);
    setFilteredGalleries(data || []);
    setLoading(false);
  };

  const fetchPhotos = async (galleryId: number) => {
    const res = await fetch(`/api/gallery/${galleryId}/images`);
    const data = await res.json();
    setPhotos(data || []);
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  useEffect(() => {
    if (searchFilter) {
      const filtered = galleries.filter((g) =>
        g.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        g.slug.toLowerCase().includes(searchFilter.toLowerCase())
      );
      setFilteredGalleries(filtered);
      setPagination((prev) => ({ ...prev, page: 1, total: filtered.length }));
    } else {
      setFilteredGalleries(galleries);
      setPagination((prev) => ({ ...prev, total: galleries.length }));
    }
  }, [searchFilter, galleries]);

  // ================= CREATE / UPDATE GALLERY =================
  const openCreate = () => {
    setEditing(null);
    setTitle("");
    setSlug("");
    setThumbnail(null);
    setShowForm(true);
  };

  const openEdit = (g: Gallery) => {
    setEditing(g);
    setTitle(g.title);
    setSlug(g.slug);
    setThumbnail(null);
    setShowForm(true);
  };

  const saveGallery = async () => {
    // Validation
    if (!title.trim()) {
      setAlertModal({
        type: "error",
        title: "Validation Error",
        message: "Gallery title is required.",
        onClose: () => setAlertModal(null),
      });
      return;
    }

    if (!slug.trim()) {
      setAlertModal({
        type: "error",
        title: "Validation Error",
        message: "Gallery slug is required.",
        onClose: () => setAlertModal(null),
      });
      return;
    }

    const form = new FormData();
    form.append("title", title.trim());
    if (slug) form.append("slug", slug.trim());
    if (thumbnail) form.append("thumbnail", thumbnail);

    let url = "/api/gallery";
    let method: "POST" | "PUT" = "POST";
    if (editing) {
      url = `/api/gallery/${editing.id}`;
      method = "PUT";
    }

    const res = await fetch(url, { method, body: form });
    const data = await res.json();

    if (res.ok) {
      setShowForm(false);
      await fetchGalleries();
      setAlertModal({
        type: "success",
        title: editing ? "Gallery Updated" : "Gallery Created",
        message: editing ? "The gallery was updated successfully." : "The gallery was created successfully.",
        onClose: () => setAlertModal(null),
      });
    } else {
      setAlertModal({
        type: "error",
        title: "Error",
        message: data?.error || "Failed to save gallery",
        onClose: () => setAlertModal(null),
      });
    }
  };

  const deleteGallery = async (id: number) => {
    setAlertModal({
      type: "confirm",
      title: "Confirm Delete",
      message: "Delete this gallery? All its photos will be removed. This action cannot be undone.",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
          const data = await res.json();

          if (res.ok) {
            if (selectedGallery?.id === id) {
              setSelectedGallery(null);
              setPhotos([]);
            }
            await fetchGalleries();
            setAlertModal({
              type: "success",
              title: "Deleted Successfully",
              message: "The gallery was deleted successfully.",
              onClose: () => setAlertModal(null),
            });
          } else {
            throw new Error(data?.error || "Failed to delete gallery");
          }
        } catch (error) {
          setAlertModal({
            type: "error",
            title: "Error",
            message: error instanceof Error ? error.message : "Failed to delete gallery",
            onClose: () => setAlertModal(null),
          });
        }
      },
      onClose: () => setAlertModal(null),
    });
  };

  // ================= PHOTOS =================
  const openPhotos = async (g: Gallery) => {
    setSelectedGallery(g);
    await fetchPhotos(g.id);
  };

  const uploadPhotos = async () => {
    if (!selectedGallery || !files || files.length === 0) {
      setAlertModal({
        type: "error",
        title: "Validation Error",
        message: "Please select at least one photo to upload.",
        onClose: () => setAlertModal(null),
      });
      return;
    }

    setUploading(true);

    const form = new FormData();
    form.append("gallery_id", String(selectedGallery.id));
    for (let i = 0; i < files.length; i++) {
      form.append("images", files[i]);
    }

    const res = await fetch(`/api/gallery/images`, { method: "POST", body: form });
    const data = await res.json();
    setUploading(false);

    if (res.ok) {
      setFiles(null);
      setPhotos(data.photos || []);
      await fetchGalleries();
      setSelectedGallery(null); // Close modal
      setAlertModal({
        type: "success",
        title: "Photos Uploaded",
        message: "Photos were uploaded successfully.",
        onClose: () => setAlertModal(null),
      });
    } else {
      setAlertModal({
        type: "error",
        title: "Upload Failed",
        message: data?.error || "Failed to upload photos",
        onClose: () => setAlertModal(null),
      });
    }
  };

  const deletePhoto = async (photoId: number) => {
    setAlertModal({
      type: "confirm",
      title: "Confirm Delete",
      message: "Are you sure you want to delete this photo? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/gallery/images/${photoId}`, { method: "DELETE" });

          if (res.ok) {
            setPhotos((prev) => prev.filter((p) => p.id !== photoId));
            await fetchGalleries();
            setAlertModal({
              type: "success",
              title: "Deleted Successfully",
              message: "The photo was deleted successfully.",
              onClose: () => setAlertModal(null),
            });
          } else {
            const data = await res.json();
            throw new Error(data?.error || "Failed to delete photo");
          }
        } catch (error) {
          setAlertModal({
            type: "error",
            title: "Error",
            message: error instanceof Error ? error.message : "Failed to delete photo",
            onClose: () => setAlertModal(null),
          });
        }
      },
      onClose: () => setAlertModal(null),
    });
  };

  const activeFiltersCount = searchFilter ? 1 : 0;

  // Pagination logic
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const startIndex = (pagination.page - 1) * pagination.limit;
  const endIndex = startIndex + pagination.limit;
  const paginatedGalleries = filteredGalleries.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {alertModal && <Modal {...alertModal} />}

      <div className="px-6 py-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Gallery Management</h2>
        <nav className="text-sm text-gray-500 mt-2 sm:mt-0">
          <a href="/admin/dashboard" className="hover:underline hover:text-blue-600 transition-colors">
            Home
          </a>{" "}
          / <span className="text-gray-700">Gallery</span>
        </nav>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="w-full flex justify-end items-center gap-3 mb-6">
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">New Gallery</span>
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
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Search Galleries
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="Search by title or slug..."
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
                </div>
              </div>
            )}
          </div>

          {/* GALLERIES LIST */}
          {loading ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center text-gray-500">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              Loading galleries...
            </div>
          ) : filteredGalleries.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <ImagePlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No galleries found</p>
              <p className="text-gray-400 text-sm mt-2">
                {searchFilter ? "Try adjusting your search" : "Create your first gallery to get started"}
              </p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="flex flex-col divide-y divide-gray-100">
                  {paginatedGalleries.map((g, index) => (
                    <motion.div
                      key={g.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Thumbnail */}
                        <div className="w-full sm:w-24 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                          {g.thumbnail_url ? (
                            <img
                              src={g.thumbnail_url}
                              alt={g.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <ImagePlus className="w-5 h-5" />
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="space-y-2">
                            {/* Title */}
                            <h3
                              className="text-lg font-semibold text-gray-900 max-w-xs truncate hover:whitespace-normal hover:break-words"
                              title={g.title}
                            >
                              {g.title.length > 70 ? g.title.substring(0, 70) + '...' : g.title}
                            </h3>

                            {/* Meta Info */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                              <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
                                <ImagePlus size={12} />
                                {g.photo_count} Photos
                              </div>

                              <div className="text-xs sm:text-sm text-gray-600">
                                Created on{" "}
                                <span className="font-medium text-gray-800">
                                  {new Date(g.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 flex-wrap sm:flex-nowrap sm:ml-auto">
                          <button
                            onClick={() => openPhotos(g)}
                            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-all shadow-sm hover:shadow-md"
                          >
                            Manage Photos
                          </button>
                          <button
                            onClick={() => openEdit(g)}
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteGallery(g.id)}
                            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-all shadow-sm hover:shadow-md"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-bold text-gray-900">
                        {pagination.total === 0 ? 0 : startIndex + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-bold text-gray-900">
                        {Math.min(endIndex, pagination.total)}
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
              )}
            </>
          )}
        </div>
      </div>

      {/* CREATE/EDIT FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{editing ? "Edit Gallery" : "New Gallery"}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!editing) setSlug(slugify(e.target.value));
                  }}
                  placeholder="Enter gallery title"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Slug</label>
                <input
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="gallery-slug"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Thumbnail (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={saveGallery}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                {editing ? "Update Gallery" : "Create Gallery"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHOTOS DRAWER */}
      {selectedGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-6xl rounded-xl shadow-2xl relative max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Photos: {selectedGallery.title}</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setSelectedGallery(null);
                  setPhotos([]);
                }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3 flex-wrap">
                <input
                  multiple
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFiles(e.target.files)}
                  className="flex-1 border border-gray-300 rounded-lg p-2 text-sm"
                />
                <button
                  onClick={uploadPhotos}
                  disabled={uploading}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-all inline-flex items-center gap-2 disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} /> Uploading...
                    </>
                  ) : (
                    <>
                      <ImagePlus size={16} /> Upload Photos
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {photos.length === 0 ? (
                <div className="text-center py-12">
                  <ImagePlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">No photos yet</p>
                  <p className="text-gray-400 text-sm mt-2">Upload photos to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {photos.map((p, index) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      className="relative rounded-lg overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-shadow group"
                    >
                      <img src={p.image_url} className="w-full h-48 object-cover" alt="" />
                      <button
                        className="absolute top-2 right-2 bg-white/90 p-2 rounded-lg text-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-white"
                        onClick={() => deletePhoto(p.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}