"use client";

import React, { useState, useEffect, Suspense } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import {
  Save,
  X,
  Tag,
  FileText,
  Image as ImageIcon,
  Sparkles,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import RichTextEditor from "@/components/RichTextEditor";
import BlogComments from "@/components/blog-comments-module";


// ⚡ Modal for Success/Error
const Modal = ({ type, title, message, onClose }: any) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
      <div className="flex items-start gap-4">
        {type === "success" && (
          <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
        )}
        {type === "error" && (
          <AlertCircle className="w-6 h-6 text-red-600 mt-1" />
        )}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 whitespace-pre-wrap">{message}</p>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <Button onClick={onClose} className="bg-blue-600 text-white hover:bg-blue-700">
          Close
        </Button>
      </div>
    </div>
  </div>
);

interface BlogFormData {
  blog_title: string;
  slug: string;
  blog_content: string;
  blog_image: string;
  blog_cateogry: string;
}

// Loading state
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#019c9d]"></div>
      <p className="text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

const generateSlug = (title: string): string =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const AddBlogContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const blogId = searchParams.get("id");

  const [formData, setFormData] = useState<BlogFormData>({
    blog_title: "",
    slug: "",
    blog_content: "",
    blog_image: "",
    blog_cateogry: "",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alertModal, setAlertModal] = useState<any>(null);
  const [editingBlog, setEditingBlog] = useState(false);

  const categories = [
    "Thought Leadership",
    "Client Impact Stories",
    "Industry Insights",
    "Company Updates",
  ];

  useEffect(() => {
    if (blogId) {
      fetchBlog(blogId);
      setEditingBlog(true);
    }
  }, [blogId]);

  const fetchBlog = async (id: string) => {
    try {
      const res = await fetch(`/api/blogs/${id}`);
      const data = await res.json();
      setFormData({
        blog_title: data.blog_title,
        slug: data.slug,
        blog_content: data.blog_content,
        blog_image: data.blog_image,
        blog_cateogry: data.blog_cateogry,
      });
      setImagePreview(data.blog_image);
    } catch {
      setAlertModal({
        type: "error",
        title: "Error",
        message: "Failed to load blog details.",
        onClose: () => setAlertModal(null),
      });
    }
  };

  const handleInputChange = (field: keyof BlogFormData, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "blog_title") updated.slug = generateSlug(value);
      return updated;
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("blog_title", formData.blog_title);
      submitData.append("slug", formData.slug);
      submitData.append("blog_content", formData.blog_content);
      submitData.append("blog_cateogry", formData.blog_cateogry);

      if (blogId && !selectedImage && formData.blog_image) {
        submitData.append("existing_image_path", formData.blog_image);
      }
      if (selectedImage) {
        submitData.append("image", selectedImage);
      }

      const url = blogId ? `/api/blogs/${blogId}` : "/api/blogs";
      const method = blogId ? "PUT" : "POST";

      const response = await fetch(url, { method, body: submitData });
      const result = await response.json();

      if (response.ok) {
        setAlertModal({
          type: "success",
          title: "Success",
          message: blogId
            ? "Blog updated successfully!"
            : "Blog created successfully!",
          onClose: () => {
            setAlertModal(null);
            router.push("/Admin-blog-panel");
          },
        });
      } else {
        throw new Error(result.error || "Failed to save blog.");
      }
    } catch (error: any) {
      setAlertModal({
        type: "error",
        title: "Error",
        message: error.message || "An unexpected error occurred.",
        onClose: () => setAlertModal(null),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      {alertModal && <Modal {...alertModal} />}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{blogId ? "Edit Blog" : "Add New Blog"}</h2>
        <nav className="text-sm text-gray-500">
          <a href="/admin/dashboard" className="hover:underline">
            Home
          </a>{" "}
          /{" "}
          <a href="/Admin-blog-panel" className="hover:underline">
            Blogs
          </a>{" "}
          / <span>{blogId ? "Edit Blog" : "Add Blog"}</span>
        </nav>
      </div>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{blogId ? "Edit Blog" : "Create New Blog"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <FileText size={16} className="mr-2" />
                    Blog Title
                  </label>
                  <Input
                    value={formData.blog_title}
                    onChange={(e) =>
                      handleInputChange("blog_title", e.target.value)
                    }
                    placeholder="Enter blog title..."
                    required
                  />
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <Input
                    value={formData.slug}
                    readOnly
                    className="bg-gray-50 dark:bg-gray-800"
                    placeholder="Auto-generated slug..."
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <Tag size={16} className="mr-2" />
                    Category
                  </label>
                  <Select
                    value={formData.blog_cateogry}
                    onValueChange={(value) =>
                      handleInputChange("blog_cateogry", value)
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <ImageIcon size={16} className="mr-2" />
                    Blog Image
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#019c9d] file:text-white hover:file:bg-[#017879] cursor-pointer"
                    />
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={clearImage}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Blog Content</label>
                  <RichTextEditor
                    value={formData.blog_content}
                    onChange={(value) =>
                      handleInputChange("blog_content", value)
                    }
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/Admin-blog-panel")}
                    disabled={isLoading}
                  >
                    <X size={16} className="mr-2" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#019c9d] hover:bg-[#017879] disabled:opacity-50"
                  >
                    <Save size={16} className="mr-2" />
                    {isLoading
                      ? "Saving..."
                      : editingBlog
                      ? "Update Blog"
                      : "Create Blog"}
                  </Button>
                </div>
              </form>
            </CardContent>
             {blogId && (
              <BlogComments contentId={Number(blogId)} />
            )}
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

// Main Component
const AddBlog = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <AddBlogContent />
  </Suspense>
);

export default AddBlog;
