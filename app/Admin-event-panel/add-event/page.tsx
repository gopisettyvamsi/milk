"use client";

import React, { useState, useEffect, Suspense } from "react";
import AdminLayout from '@/components/layouts/AdminLayout';
import {
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Calendar,
  MapPin,
  Clock,
  FileText,
  Tag,
  IndianRupee,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams } from 'next/navigation';
import RichTextEditor from "@/components/RichTextEditor";

// ============ INTERFACES ============
interface EventFormData {
  event_title: string;
  event_description: string;
  event_image: string;
  event_location: string;
  event_start_date: string;
  event_end_date: string;
  event_start_time: string;
  event_end_time: string;
  event_category: string;
  event_price: number | string;
  slug: string;
  earlybird_registration_date: string; // ✅ NEW
}

interface Magazine {
  id: number;
  title: string;
  author: string;
  publish_date: string;
  is_published: boolean;
  event_id?: number;
  file_url?: string;
  brochure_url?: string;
}

interface MagazineFormData {
  title: string;
  author: string;
  publish_date: string;
  is_published: boolean;
}

interface QuestionOption {
  id: number;
  value: string;
}

interface Question {
  id: number;
  question: string;
  type: "text" | "textarea" | "radio" | "checkbox";
  answer: string;
  options: QuestionOption[];
  isRequired: boolean;
}

// ============ FILE TO PDF CONVERTER ============
const convertToPDF = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    // Check if file is already PDF
    if (file.type === 'application/pdf') {
      resolve(file);
      return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;

        // For images and documents, we'll create a simple PDF representation
        // In a real implementation, you might want to use a proper PDF generation library
        const pdfContent = `
%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 100 >>
stream
BT
/F1 12 Tf
50 750 Td
(Converted File: ${file.name}) Tj
0 -20 Td
(Original Type: ${file.type}) Tj
0 -20 Td
(Size: ${(file.size / 1024).toFixed(2)} KB) Tj
0 -20 Td
(Conversion Date: ${new Date().toLocaleDateString()}) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000239 00000 n 
0000000415 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
525
%%EOF
        `.trim();

        const pdfBlob = new Blob([pdfContent], { type: 'application/pdf' });
        resolve(pdfBlob);
      } catch (error) {
        reject(new Error('Failed to convert file to PDF'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsArrayBuffer(file);
  });
};

// ============ TAB NAVIGATION ============
const TabNavigation = ({ activeTab, setActiveTab, tabs, eventId }) => {
  const router = useRouter();

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (eventId) {
      router.push(`?id=${eventId}&tab=${tabId}`);
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
      <div className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            disabled={!eventId && tab.id !== "event"}
            className={`py-4 px-2 font-medium text-sm transition-all border-b-2 ${activeTab === tab.id
              ? "border-[#019c9d] text-[#019c9d]"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// ============ MAGAZINE TAB ============
const MagazineTab = ({ eventId }) => {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMag, setEditingMag] = useState<Magazine | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<MagazineFormData>({
    title: "",
    author: "",
    publish_date: "",
    is_published: false,
  });
  const [files, setFiles] = useState<{ file: File | null; brochure: File | null }>({
    file: null,
    brochure: null,
  });
  const [existingFiles, setExistingFiles] = useState<{ file: string | null; brochure: string | null }>({
    file: null,
    brochure: null,
  });
  const [conversionProgress, setConversionProgress] = useState<{
    file: boolean;
    brochure: boolean;
  }>({ file: false, brochure: false });
  const searchParams = useSearchParams();
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (eventId && !hasInitialized) {
      fetchMagazines();
      const action = searchParams.get("action");
      if (action === "new") {
        setShowForm(true);
        resetForm();
      }
      setHasInitialized(true);
    }
  }, [eventId, searchParams, hasInitialized]);

  const fetchMagazines = async () => {
    try {
      const response = await fetch(`/api/admin/magazine?eventId=${eventId}`);
      if (!response.ok) throw new Error("Failed to fetch magazines");
      const data = await response.json();
      setMagazines(data.data || []);
    } catch (error) {
      console.error("Error fetching magazines:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      publish_date: "",
      is_published: false,
    });
    setFiles({ file: null, brochure: null });
    setExistingFiles({ file: null, brochure: null });
    setEditingMag(null);
    setConversionProgress({ file: false, brochure: false });
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEditMagazine = async (mag: Magazine) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/magazine?id=${mag.id}`);
      if (!response.ok) throw new Error("Failed to fetch magazine");

      const data = await response.json();
      const magazine = data.data;

      setFormData({
        title: magazine.title || "",
        author: magazine.author || "",
        publish_date: magazine.publish_date || "",
        is_published: magazine.is_published === 1 || false,
      });

      // Set existing files for display
      setExistingFiles({
        file: magazine.file_url || null,
        brochure: magazine.brochure_url || null,
      });

      setEditingMag(magazine);
      setShowForm(true);
    } catch (error) {
      console.error("Error fetching magazine:", error);
      alert("Failed to load magazine details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (fileType: 'file' | 'brochure', selectedFile: File | null) => {
    if (!selectedFile) {
      setFiles(prev => ({ ...prev, [fileType]: null }));
      return;
    }

    // Check file size (limit to 50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB');
      return;
    }

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert('Please upload PDF, image, or document files only');
      return;
    }

    setConversionProgress(prev => ({ ...prev, [fileType]: true }));

    try {
      // Convert to PDF if not already PDF
      let pdfFile: File;
      if (selectedFile.type === 'application/pdf') {
        pdfFile = selectedFile;
      } else {
        const pdfBlob = await convertToPDF(selectedFile);
        pdfFile = new File(
          [pdfBlob],
          `${selectedFile.name.split('.')[0]}.pdf`,
          { type: 'application/pdf' }
        );
      }

      setFiles(prev => ({ ...prev, [fileType]: pdfFile }));
      // Clear existing file when new file is uploaded
      setExistingFiles(prev => ({ ...prev, [fileType]: null }));
      alert(`${fileType === 'file' ? 'Magazine' : 'Brochure'} file uploaded  successfully!`);
    } catch (error) {
      console.error(`Error converting ${fileType} to PDF:`, error);
      alert(`Failed to convert ${fileType} to PDF. Please try again.`);
    } finally {
      setConversionProgress(prev => ({ ...prev, [fileType]: false }));
    }
  };

  const handleSaveMagazine = async () => {
    if (!formData.title.trim()) {
      alert("Please enter a title");
      return;
    }

    // FIXED: Allow saving if either magazine OR brochure is provided
    if (!editingMag && !files.file && !files.brochure) {
      alert("Please upload at least one file (magazine or brochure) for new document");
      return;
    }

    // FIXED: For editing, allow saving even if no new files are uploaded (keeping existing ones)
    if (editingMag && !files.file && !files.brochure && !existingFiles.file && !existingFiles.brochure) {
      alert("Please upload at least one file (magazine or brochure)");
      return;
    }

    try {
      setIsLoading(true);
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("author", formData.author);
      submitData.append("publish_date", formData.publish_date);
      submitData.append("is_published", formData.is_published.toString());
      submitData.append("event_id", eventId);

      if (files.file) submitData.append("magazine_file", files.file);
      if (files.brochure) submitData.append("brochure_file", files.brochure);

      // For editing, indicate if we should keep existing files
      if (editingMag) {
        submitData.append("keep_existing_files", "true");
      }

      const url = editingMag
        ? `/api/admin/magazine?id=${editingMag.id}`
        : "/api/admin/magazine";
      const method = editingMag ? "PUT" : "POST";

      const response = await fetch(url, { method, body: submitData });
      if (!response.ok) throw new Error("Failed to save magazine");

      alert(`Document ${editingMag ? "updated" : "created"} successfully!`);
      resetForm();
      setShowForm(false);
      await fetchMagazines();
    } catch (error) {
      console.error("Error saving magazine:", error);
      alert("Failed to save document");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMagazine = async (id: number) => {
    if (confirm("Are you sure you want to delete this document?")) {
      try {
        const response = await fetch(`/api/admin/magazine?id=${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete document");

        alert("Document deleted successfully!");
        await fetchMagazines();
      } catch (error) {
        console.error("Error deleting document:", error);
        alert("Failed to delete document");
      }
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    resetForm();
  };

  // Only show "Add Document" button if form is not showing AND there are no magazines
  const shouldShowAddButton = !showForm && magazines.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Documents</h3>
        {shouldShowAddButton && (
          <button
            onClick={handleAddNew}
            className="flex items-center px-4 py-2 bg-[#019c9d] text-white rounded-md hover:bg-[#017879]"
          >
            <Plus size={16} className="mr-2" />
            Add Document
          </button>
        )}
      </div>

      {showForm && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-800">
          <h4 className="text-lg font-semibold mb-4">
            {editingMag ? "Edit Document" : "Add Document"}
          </h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Document title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  placeholder="Author name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Publish Date</label>
                <input
                  type="date"
                  value={formData.publish_date}
                  onChange={(e) =>
                    setFormData({ ...formData, publish_date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">
                  Magazine File {!editingMag && " *"}
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.txt,.ppt,.pptx"
                    onChange={(e) => handleFileChange('file', e.target.files?.[0] || null)}
                    className="w-full text-sm mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#019c9d] file:text-white"
                    disabled={conversionProgress.file}
                  />
                  {conversionProgress.file && (
                    <div className="text-sm text-blue-600 flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Converting to PDF...
                    </div>
                  )}
                  {files.file && (
                    <div className="text-sm text-green-600">
                      ✓ New file: {files.file.name}
                    </div>
                  )}
                  {existingFiles.file && !files.file && (
                    <div className="text-sm text-gray-600">
                      ✓ Current file: <a href={existingFiles.file} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View PDF</a>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: only PDF.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Brochure File (Optional)
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.txt,.ppt,.pptx"
                    onChange={(e) => handleFileChange('brochure', e.target.files?.[0] || null)}
                    className="w-full text-sm mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#019c9d] file:text-white"
                    disabled={conversionProgress.brochure}
                  />
                  {conversionProgress.brochure && (
                    <div className="text-sm text-blue-600 flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Converting to PDF...
                    </div>
                  )}
                  {files.brochure && (
                    <div className="text-sm text-green-600">
                      ✓ New file: {files.brochure.name}
                    </div>
                  )}
                  {existingFiles.brochure && !files.brochure && (
                    <div className="text-sm text-gray-600">
                      ✓ Current file: <a href={existingFiles.brochure} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View PDF</a>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: only PDF.
                </p>
              </div>
            </div>

            {/* <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                <strong>Note:</strong> You can upload either Magazine, Brochure, or both. At least one file is required.
                {editingMag && " Existing files will be kept unless you upload new ones."}
              </p>
            </div> */}

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={handleCancelForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMagazine}
                disabled={isLoading || conversionProgress.file || conversionProgress.brochure}
                className="px-4 py-2 bg-[#019c9d] text-white rounded-md hover:bg-[#017879] disabled:opacity-50 flex items-center"
              >
                <Save size={16} className="mr-2" />
                {isLoading ? "Saving..." : editingMag ? "Update Document" : "Save Document"}
              </button>
            </div>
          </div>
        </div>
      )}

      {magazines.length === 0 && !showForm ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <FileText size={48} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500 dark:text-gray-400">No documents yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {magazines.map((mag) => (
            <div
              key={mag.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h4 className="font-semibold">{mag.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  By {mag.author}
                </p>
                <div className="flex space-x-4 mt-2">
                  {mag.file_url && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Magazine PDF
                    </span>
                  )}
                  {mag.brochure_url && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Brochure PDF
                    </span>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditMagazine(mag)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteMagazine(mag.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PricingTab = ({ eventId }) => {
  const [prices, setPrices] = useState([
    { category_id: 1, category_name: "Faculty/Medical Officer", price: "", earlybird_registration_price: "", spot_registration_price: "" },
    { category_id: 2, category_name: "Private Practitioner", price: "", earlybird_registration_price: "", spot_registration_price: "" },
    { category_id: 3, category_name: "PG/PhD Scholar", price: "", earlybird_registration_price: "", spot_registration_price: "" },
    { category_id: 4, category_name: "UG/Intern", price: "", earlybird_registration_price: "", spot_registration_price: "" },

  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (eventId) fetchPrices();
  }, [eventId]);

  const fetchPrices = async () => {
    try {
      const res = await fetch(`/api/admin/pricing?event_id=${eventId}`);
      if (!res.ok) return;
      const data = await res.json();
      setPrices((prev) =>
        prev.map((cat) => {
          const found = data.find((d) => d.category_id === cat.category_id);
          return found ? { ...cat, ...found } : cat;
        })
      );
    } catch (err) {
      console.error("Error fetching prices:", err);
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...prices];
    updated[index][field] = value;
    setPrices(updated);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: eventId, prices }),
      });
      if (!res.ok) throw new Error("Failed to save prices");
      alert("Pricing details saved successfully!");
    } catch (err) {
      alert("Error saving prices");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Pricing</h3>
      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Normal Price</th>
            <th className="p-2 border">Early Bird Price</th>
            <th className="p-2 border">Spot Price</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((cat, index) => (
            <tr key={cat.category_id}>
              <td className="p-2 border font-medium">{cat.category_name}</td>
              <td className="p-2 border">
                <input
                  type="number"
                  value={cat.price}
                  onChange={(e) => handleChange(index, "price", e.target.value)}
                  className="w-full border rounded px-2 py-1 appearance-none focus:outline-none"
                  style={{ MozAppearance: "textfield" }}
                />

              </td>
              <td className="p-2 border">
                <input
                  type="number"
                  value={cat.earlybird_registration_price}
                  onChange={(e) =>
                    handleChange(index, "earlybird_registration_price", e.target.value)
                  }
                  className="w-full border rounded px-2 py-1"
                />
              </td>
              <td className="p-2 border">
                <input
                  type="number"
                  value={cat.spot_registration_price}
                  onChange={(e) =>
                    handleChange(index, "spot_registration_price", e.target.value)
                  }
                  className="w-full border rounded px-2 py-1"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 bg-[#019c9d] text-white rounded-md hover:bg-[#017879]"
        >
          {loading ? "Saving..." : "Save Pricing"}
        </button>
      </div>
    </div>
  );
};


// ============ QUESTIONS TAB ============
// ============ QUESTIONS TAB ============
const QuestionsTab = ({ eventId }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showQuestionPopup, setShowQuestionPopup] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [newQuestion, setNewQuestion] = useState<Omit<Question, "id" | "answer">>({
    question: "",
    type: "text",
    options: [],
    isRequired: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const questionTypes = [
    { value: "text", label: "Short Text" },
    { value: "textarea", label: "Long Text" },
    { value: "radio", label: "Single Choice" },
    { value: "checkbox", label: "Multiple Choice" },
  ];

  // Fetch existing questions when eventId is available
  useEffect(() => {
    if (eventId) {
      fetchQuestions();
    }
  }, [eventId]);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/questions?event_id=${eventId}`);

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched questions data:", data);

        if (data.data && Array.isArray(data.data)) {
          const formattedQuestions = data.data.map((q: any) => ({
            id: q.id,
            question: q.question,
            type: q.type,
            answer: "",
            options: q.options && q.options.length > 0
              ? q.options.map((opt: string, index: number) => ({
                id: index + 1,
                value: opt.trim()
              }))
              : [],
            isRequired: Boolean(q.is_required),
          }));
          setQuestions(formattedQuestions);
        } else {
          console.warn("No questions data found in response");
          setQuestions([]);
        }
      } else if (response.status === 404) {
        setQuestions([]);
      } else {
        const errorText = await response.text();
        throw new Error(`Failed to fetch questions: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("Failed to fetch questions: " + error.message);
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionChange = (id: number, field: string, value: any) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === id) {
          if (field === "type") {
            const newType = value as string;
            const shouldResetOptions = !["radio", "checkbox"].includes(newType);
            return {
              ...q,
              type: newType as any,
              options: shouldResetOptions ? [] : q.options,
              answer: "",
            };
          }
          return { ...q, [field]: value };
        }
        return q;
      })
    );
  };

  const openQuestionPopup = () => {
    setEditingQuestion(null);
    setNewQuestion({
      question: "",
      type: "text",
      options: [],
      isRequired: false,
    });
    setShowQuestionPopup(true);
  };

  const openEditQuestionPopup = (question: Question) => {
    setEditingQuestion(question);
    setNewQuestion({
      question: question.question,
      type: question.type,
      options: question.options.map(opt => ({ ...opt })),
      isRequired: question.isRequired,
    });
    setShowQuestionPopup(true);
  };

  const closeQuestionPopup = () => {
    setShowQuestionPopup(false);
    setEditingQuestion(null);
  };

  const handleNewQuestionChange = (field: string, value: any) => {
    if (field === "type") {
      const newType = value as string;
      const shouldResetOptions = !["radio", "checkbox"].includes(newType);
      setNewQuestion({
        ...newQuestion,
        type: newType as any,
        options: shouldResetOptions ? [] : newQuestion.options,
      });
    } else {
      setNewQuestion({ ...newQuestion, [field]: value });
    }
  };

  const addOptionToNewQuestion = () => {
    setNewQuestion({
      ...newQuestion,
      options: [...newQuestion.options, { id: Date.now(), value: "" }],
    });
  };

  const updateOptionInNewQuestion = (optionId: number, value: string) => {
    setNewQuestion({
      ...newQuestion,
      options: newQuestion.options.map((opt) =>
        opt.id === optionId ? { ...opt, value } : opt
      ),
    });
  };

  const removeOptionFromNewQuestion = (optionId: number) => {
    setNewQuestion({
      ...newQuestion,
      options: newQuestion.options.filter((opt) => opt.id !== optionId),
    });
  };

  const addNewQuestionFromPopup = async () => {
    if (!newQuestion.question.trim()) {
      alert("Please enter a question text");
      return;
    }

    // Validate options for radio and checkbox types
    if (["radio", "checkbox"].includes(newQuestion.type) && newQuestion.options.length === 0) {
      alert("Please add at least one option for this question type");
      return;
    }

    // Validate that all options have values
    if (["radio", "checkbox"].includes(newQuestion.type)) {
      const emptyOption = newQuestion.options.find(opt => !opt.value.trim());
      if (emptyOption) {
        alert("Please fill in all option values");
        return;
      }
    }

    try {
      setIsSaving(true);

      // Prepare data for API
      const questionData = {
        event_id: eventId,
        question: newQuestion.question.trim(),
        type: newQuestion.type,
        options: newQuestion.options.map(opt => opt.value.trim()),
        is_required: newQuestion.isRequired,
        sort_order: questions.length
      };

      const response = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create question');
      }

      const result = await response.json();

      const questionToAdd: Question = {
        id: result.data.id,
        question: result.data.question,
        type: result.data.type,
        answer: "",
        options: result.data.options.map((opt: string, index: number) => ({
          id: index + 1,
          value: opt
        })),
        isRequired: result.data.is_required,
      };

      setQuestions([...questions, questionToAdd]);
      closeQuestionPopup();
      alert("Question created successfully!");

    } catch (error) {
      console.error("Error creating question:", error);
      alert(error.message || "Failed to create question");
    } finally {
      setIsSaving(false);
    }
  };

  const updateQuestionFromPopup = async () => {
    if (!editingQuestion) return;

    if (!newQuestion.question.trim()) {
      alert("Please enter a question text");
      return;
    }

    // Validate options for radio and checkbox types
    if (["radio", "checkbox"].includes(newQuestion.type) && newQuestion.options.length === 0) {
      alert("Please add at least one option for this question type");
      return;
    }

    // Validate that all options have values
    if (["radio", "checkbox"].includes(newQuestion.type)) {
      const emptyOption = newQuestion.options.find(opt => !opt.value.trim());
      if (emptyOption) {
        alert("Please fill in all option values");
        return;
      }
    }

    try {
      setIsSaving(true);

      // Prepare data for API
      const questionData = {
        event_id: eventId,
        question: newQuestion.question.trim(),
        type: newQuestion.type,
        options: newQuestion.options.map(opt => opt.value.trim()),
        is_required: newQuestion.isRequired,
        sort_order: questions.findIndex(q => q.id === editingQuestion.id)
      };

      const response = await fetch(`/api/admin/questions?id=${editingQuestion.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update question');
      }

      const result = await response.json();

      // Update the question in local state
      const updatedQuestion: Question = {
        id: editingQuestion.id,
        question: result.data.question,
        type: result.data.type,
        answer: "",
        options: result.data.options.map((opt: string, index: number) => ({
          id: index + 1,
          value: opt
        })),
        isRequired: result.data.is_required,
      };

      setQuestions(questions.map(q => q.id === editingQuestion.id ? updatedQuestion : q));
      closeQuestionPopup();
      alert("Question updated successfully!");

    } catch (error) {
      console.error("Error updating question:", error);
      alert(error.message || "Failed to update question");
    } finally {
      setIsSaving(false);
    }
  };

  const removeQuestion = async (id: number) => {
    if (!id || id === 0) {
      alert("Invalid question ID");
      return;
    }

    if (confirm("Are you sure you want to delete this question?")) {
      try {
        const response = await fetch(`/api/admin/questions?id=${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete question');
        }

        const result = await response.json();

        if (result.success) {
          setQuestions(questions.filter((q) => q.id !== id));
          alert("Question deleted successfully!");
        } else {
          throw new Error(result.error || 'Failed to delete question');
        }
      } catch (error) {
        console.error("Error deleting question:", error);
        alert(error.message || "Failed to delete question");
      }
    }
  };

  const addOption = (questionId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? { ...q, options: [...q.options, { id: Date.now(), value: "" }] }
          : q
      )
    );
  };

  const updateOption = (questionId: number, optionId: number, value: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
            ...q,
            options: q.options.map((opt) =>
              opt.id === optionId ? { ...opt, value } : opt
            ),
          }
          : q
      )
    );
  };

  const removeOption = (questionId: number, optionId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
            ...q,
            options: q.options.filter((opt) => opt.id !== optionId),
          }
          : q
      )
    );
  };

  const handleSaveQuestions = async () => {
    try {
      setIsSaving(true);

      for (const question of questions) {
        const questionData = {
          event_id: eventId,
          question: question.question.trim(),
          type: question.type,
          options: question.options.map(opt => opt.value.trim()),
          is_required: question.isRequired,
          sort_order: questions.indexOf(question)
        };

        const url = question.id
          ? `/api/admin/questions?id=${question.id}`
          : '/api/admin/questions';

        const method = question.id ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(questionData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to save question: ${question.question}`);
        }
      }

      alert("All questions saved successfully!");
      await fetchQuestions();

    } catch (error) {
      console.error("Error saving questions:", error);
      alert(error.message || "Failed to save questions");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateQuestion = async (question: Question) => {
    if (!question.id || question.id === 0) {
      console.warn("Cannot update question without valid ID:", question);
      return;
    }

    try {
      const questionData = {
        event_id: eventId,
        question: question.question.trim(),
        type: question.type,
        options: question.options.map(opt => opt.value.trim()),
        is_required: question.isRequired,
        sort_order: questions.indexOf(question)
      };

      const response = await fetch(`/api/admin/questions?id=${question.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update question');
      }

      console.log("Question updated successfully:", question.id);

    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#019c9d]"></div>
        <span className="ml-2">Loading questions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Create custom questions and forms for your event attendees. Choose the question type and configure options as needed.
        </p>
      </div>



      {questions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <MessageSquare size={48} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500 dark:text-gray-400">No questions yet</p>
          <p className="text-sm text-gray-400 mt-1">Add your first question to get started</p>
        </div>
      ) : (
        questions.map((question) => (
          <div
            key={question.id}
            className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4 bg-white dark:bg-gray-800"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 space-y-4 w-full">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Question Text
                  </label>
                  <Input
                    value={question.question}
                    onChange={(e) =>
                      handleQuestionChange(
                        question.id,
                        "question",
                        e.target.value
                      )
                    }
                    onBlur={() => handleUpdateQuestion(question)}
                    placeholder="Enter your question..."
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Question Type
                    </label>
                    <Select
                      value={question.type}
                      onValueChange={(value) =>
                        handleQuestionChange(question.id, "type", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select question type" />
                      </SelectTrigger>
                      <SelectContent>
                        {questionTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id={`required-${question.id}`}
                      checked={question.isRequired}
                      onChange={(e) =>
                        handleQuestionChange(
                          question.id,
                          "isRequired",
                          e.target.checked
                        )
                      }
                      className="text-[#019c9d] focus:ring-[#019c9d] rounded"
                    />
                    <label
                      htmlFor={`required-${question.id}`}
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Required field
                    </label>
                  </div>
                </div>

                {["radio", "checkbox"].includes(question.type) && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Options
                    </label>
                    <div className="space-y-2">
                      {question.options.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center space-x-2"
                        >
                          <Input
                            value={option.value}
                            onChange={(e) =>
                              updateOption(
                                question.id,
                                option.id,
                                e.target.value
                              )
                            }
                            onBlur={() => handleUpdateQuestion(question)}
                            placeholder="Enter option text..."
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeOption(question.id, option.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addOption(question.id)}
                        className="text-[#019c9d] hover:text-[#017879] hover:bg-[#019c9d]/10"
                      >
                        <Plus size={16} className="mr-1" />
                        Add Option
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => openEditQuestionPopup(question)}
                  className="text-[#019c9d] hover:text-[#017879] hover:bg-[#019c9d]/10"
                >
                  <Edit3 size={16} />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeQuestion(question.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))
      )}

      <Button
        type="button"
        onClick={openQuestionPopup}
        variant="outline"
        className="w-full border-dashed border-gray-300 dark:border-gray-600 py-6 hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <Plus size={20} className="mr-2" />
        Add New Question
      </Button>

      {showQuestionPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingQuestion ? "Edit Question" : "Create New Question"}
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={closeQuestionPopup}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Question Text *
                  </label>
                  <Input
                    value={newQuestion.question}
                    onChange={(e) =>
                      handleNewQuestionChange("question", e.target.value)
                    }
                    placeholder="Enter your question..."
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Question Type
                  </label>
                  <Select
                    value={newQuestion.type}
                    onValueChange={(value) =>
                      handleNewQuestionChange("type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent>
                      {questionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="new-question-required"
                    checked={newQuestion.isRequired}
                    onChange={(e) =>
                      handleNewQuestionChange("isRequired", e.target.checked)
                    }
                    className="text-[#019c9d] focus:ring-[#019c9d] rounded"
                  />
                  <label
                    htmlFor="new-question-required"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Required field
                  </label>
                </div>

                {["radio", "checkbox"].includes(newQuestion.type) && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Options *
                    </label>
                    <div className="space-y-2">
                      {newQuestion.options.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <Input
                            value={option.value}
                            onChange={(e) =>
                              updateOptionInNewQuestion(option.id, e.target.value)
                            }
                            placeholder="Enter option text..."
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              removeOptionFromNewQuestion(option.id)
                            }
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addOptionToNewQuestion}
                        className="text-[#019c9d] hover:text-[#017879] hover:bg-[#019c9d]/10"
                      >
                        <Plus size={16} className="mr-1" />
                        Add Option
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      {newQuestion.options.length === 0 && "Add at least one option for this question type"}
                    </p>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeQuestionPopup}
                    disabled={isSaving}
                  >
                    <X size={16} className="mr-2" />
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="bg-[#019c9d] hover:bg-[#017879] disabled:opacity-50"
                    onClick={editingQuestion ? updateQuestionFromPopup : addNewQuestionFromPopup}
                    disabled={isSaving || !newQuestion.question.trim() ||
                      (["radio", "checkbox"].includes(newQuestion.type) && newQuestion.options.length === 0)}
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {editingQuestion ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        {editingQuestion ? <Save size={16} className="mr-2" /> : <Plus size={16} className="mr-2" />}
                        {editingQuestion ? "Update Question" : "Add Question"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 
      {questions.length > 0 && (
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button
            type="button"
            onClick={handleSaveQuestions}
            disabled={isSaving}
            className="bg-[#019c9d] hover:bg-[#017879] disabled:opacity-50"
          >
            <Save size={16} className="mr-2" />
            {isSaving ? "Saving..." : "Save All Questions"}
          </Button>
        </div>
      )} */}
    </div>
  );
};
// ============ LOADING SPINNER ============
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#019c9d]"></div>
      <p className="text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// ============ MAIN EVENT CONTENT ============
const AddEventContent = () => {
  const [activeTab, setActiveTab] = useState("event");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [formData, setFormData] = useState<EventFormData>({
    event_title: "",
    event_description: "",
    event_image: "",
    event_location: "",
    event_start_date: "",
    event_end_date: "",
    event_start_time: "",
    event_end_time: "",
    event_category: "",
    event_price: "",
    slug: "",
    earlybird_registration_date: "", // ✅ added
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id");
  const tabParam = searchParams.get("tab");

  const categories = [
    "Technology Conference",
    "Business Workshop",
    "Networking Event",
    "Training Session",
    "Product Launch",
    "Webinar",
    "Exhibition",
    "Seminar",
    "Awards Ceremony",
    "Team Building",
  ];

  const tabs = [
    { id: "event", label: "Event Details" },
    { id: "magazine", label: "Documents" },
    { id: "questions", label: "Questions" },
    { id: "pricing", label: "Pricing" },
  ];

  useEffect(() => {
    if (tabParam && eventId) {
      setActiveTab(tabParam);
    }
  }, [tabParam, eventId]);

  const actionParam = searchParams.get("action");

  useEffect(() => {
    if (eventId && actionParam !== "new") {
      fetchEvent(eventId);
    }
  }, [eventId, actionParam]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const fetchEvent = async (id: string) => {
    try {
      const response = await fetch(`/api/events/${id}`);
      const data = await response.json();
      setFormData({
        event_title: data.event_title,
        event_description: data.event_description,
        event_image: data.event_image,
        event_location: data.event_location,
        event_start_date: formatDate(data.event_start_date),
        event_end_date: formatDate(data.event_end_date),
        event_start_time: data.event_start_time,
        event_end_time: data.event_end_time,
        event_category: data.event_category,
        event_price: data.event_price,
        slug: data.slug ?? generateSlug(data.event_title),
        earlybird_registration_date: formatDate(data.earlybird_registration_date),
      });
      setImagePreview(data.event_image);
      setEditingEvent(data);
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  };

  const handleInputChange = (
    field: keyof EventFormData,
    value: string | number
  ) => {
    const updatedForm = { ...formData, [field]: value };

    if (field === "event_title") {
      updatedForm.slug = generateSlug(value as string);
    }

    if (
      (field === "event_start_date" || field === "event_end_date") &&
      updatedForm.event_start_date &&
      updatedForm.event_end_date
    ) {
      const start = new Date(updatedForm.event_start_date);
      const end = new Date(updatedForm.event_end_date);

      if (end < start) {
        alert("Event End Date cannot be earlier than Start Date.");
        return;
      }
    }

    setFormData(updatedForm);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const resetForm = () => {
    setFormData({
      event_title: "",
      event_description: "",
      event_image: "",
      event_location: "",
      event_start_date: "",
      event_end_date: "",
      event_start_time: "",
      event_end_time: "",
      event_category: "",
      event_price: "",
      slug: "",
      earlybird_registration_date: "",
    });
    clearImage();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("event_title", formData.event_title);
      submitData.append("event_description", formData.event_description);
      submitData.append("event_location", formData.event_location);
      submitData.append("event_start_date", formData.event_start_date);
      submitData.append("event_end_date", formData.event_end_date);
      submitData.append("event_start_time", formData.event_start_time);
      submitData.append("event_end_time", formData.event_end_time);
      submitData.append("event_category", formData.event_category);
      submitData.append("event_price", formData.event_price.toString());
      submitData.append("slug", formData.slug);
      submitData.append("earlybird_registration_date", formData.earlybird_registration_date);

      if (eventId && !selectedImage && formData.event_image) {
        submitData.append("existing_image_path", formData.event_image);
      }
      if (selectedImage) {
        submitData.append("image", selectedImage);
      }

      const url = eventId ? `/api/events/${eventId}` : "/api/events";
      const method = eventId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        body: submitData,
      });

      if (response.ok) {
        const responseData = await response.json();

        if (eventId) {
          alert("Event updated successfully!");
          router.push("/Admin-event-panel");
        } else {
          resetForm();
          const newEventId = responseData.id;
          router.push(`?id=${newEventId}&tab=magazine&action=new`);
        }
      } else {
        const errorData = await response.json();
        console.error("Failed to save event:", errorData.error);
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error saving event:", error);
      alert("An error occurred while saving the event");
    } finally {
      setIsLoading(false);
    }
  };

  const isNewEventFlow = !eventId;
  const pageTitle = isNewEventFlow ? "Create Event" : "Edit Event";

  return (
    <AdminLayout>
      <div className="p-6 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{pageTitle}</h2>

          <nav className="text-sm text-gray-500">
            <a href="/admin/dashboard" className="hover:text-gray-700">
              Home
            </a>
            {" / "}
            <a href="/Admin-event-panel" className="hover:text-gray-700">
              Events
            </a>
            {" / "}
            <span className="text-gray-800 font-medium">{pageTitle}</span>
          </nav>
        </div>
      </div>

      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="pb-2"></CardHeader>

        <CardContent className="pt-4">
          <TabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={tabs}
            eventId={eventId}
          />

          {activeTab === "event" && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  <FileText size={16} className="mr-2" />
                  Event Title
                </label>
                <Input
                  value={formData.event_title}
                  onChange={(e) =>
                    handleInputChange("event_title", e.target.value)
                  }
                  placeholder="Enter event title..."
                  required
                />
              </div>

              <div>
                <Input
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  placeholder="Auto-generated slug..."
                  readOnly
                  className="bg-gray-50 dark:bg-gray-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <Tag size={16} className="mr-2" />
                    Category
                  </label>
                  <Select
                    value={formData.event_category}
                    onValueChange={(value) =>
                      handleInputChange("event_category", value)
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
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

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <IndianRupee size={16} className="mr-2" />
                    Price
                  </label>
                  <Input
                    type="number"
                    value={formData.event_price}
                    onChange={(e) =>
                      handleInputChange("event_price", e.target.value)
                    }
                    placeholder="Enter price..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <Calendar size={16} className="mr-2" />
                    Early Bird Registration Date
                  </label>
                  <Input
                    type="date"
                    value={formData.earlybird_registration_date}
                    onChange={(e) =>
                      handleInputChange("earlybird_registration_date", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  <MapPin size={16} className="mr-2" />
                  Event Location
                </label>
                <Input
                  value={formData.event_location}
                  onChange={(e) =>
                    handleInputChange("event_location", e.target.value)
                  }
                  placeholder="Enter event location..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <Calendar size={16} className="mr-2" />
                    Event Start Date
                  </label>
                  <Input
                    type="date"
                    value={formData.event_start_date}
                    onChange={(e) =>
                      handleInputChange("event_start_date", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <Calendar size={16} className="mr-2" />
                    Event End Date
                  </label>
                  <Input
                    type="date"
                    value={formData.event_end_date}
                    onChange={(e) =>
                      handleInputChange("event_end_date", e.target.value)
                    }
                    disabled={!formData.event_start_date}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <Clock size={16} className="mr-2" />
                    Event Start Time
                  </label>
                  <Input
                    type="time"
                    value={formData.event_start_time}
                    onChange={(e) =>
                      handleInputChange("event_start_time", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <Clock size={16} className="mr-2" />
                    Event End Time
                  </label>
                  <Input
                    type="time"
                    value={formData.event_end_time}
                    onChange={(e) =>
                      handleInputChange("event_end_time", e.target.value)
                    }
                    disabled={!formData.event_start_time}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  <FileText size={16} className="mr-2" />
                  Event Image
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Event Description</label>
                <RichTextEditor
                  value={formData.event_description}
                  onChange={(value) =>
                    handleInputChange("event_description", value)
                  }
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/Admin-event-panel")}
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
                    : editingEvent
                      ? "Update Event"
                      : "Create Event"}
                </Button>
              </div>
            </form>
          )}

          {activeTab === "magazine" && eventId ? (
            <MagazineTab eventId={eventId} />
          ) : activeTab === "magazine" ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                Please create the event first before adding magazines.
              </p>
            </div>
          ) : null}



          {activeTab === "questions" && eventId ? (
            <QuestionsTab eventId={eventId} />
          ) : activeTab === "questions" ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                Please create the event first before adding questions.
              </p>
            </div>
          ) : null}

          {activeTab === "pricing" && eventId ? (
            <PricingTab eventId={eventId} />
          ) : activeTab === "pricing" ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                Please create the event first before adding pricing.
              </p>
            </div>
          ) : null}

        </CardContent>
      </Card>
    </AdminLayout>
  );
};

// ============ MAIN COMPONENT WITH SUSPENSE ============
const AddEvent = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AddEventContent />
    </Suspense>
  );
};

export default AddEvent;