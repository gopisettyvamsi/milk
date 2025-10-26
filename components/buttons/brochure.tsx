import React, { useState } from "react";
import { FileText, Upload, X, Save } from "lucide-react";

const BrochureUploadButton = ({ eventId, onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("upload");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [textContent, setTextContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(file.type)) {
        alert("Please upload a valid document (PDF, DOC, or DOCX)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleSave = async () => {
    if (mode === "upload" && !selectedFile) {
      alert("Please select a file to upload");
      return;
    }

    if (mode === "text" && !textContent.trim()) {
      alert("Please enter brochure text");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();

      if (mode === "upload" && selectedFile) {
        formData.append("brochure", selectedFile);
        formData.append("type", "file");
      } else if (mode === "text") {
        formData.append("brochureText", textContent);
        formData.append("type", "text");
      }

      formData.append("eventId", eventId);

      const response = await fetch(`/api/events/${eventId}/brochure`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert("Brochure saved successfully!");
        if (onSave) onSave(data);
        handleCancel();
      } else {
        throw new Error("Save failed");
      }
    } catch (error) {
      console.error("Error saving brochure:", error);
      alert("Failed to save brochure. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setSelectedFile(null);
    setFileName("");
    setTextContent("");
    setMode("upload");
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      handleCancel();
    }
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-md transition-colors"
      >
        <FileText size={14} />
        <span>Add Brochure</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
          onClick={handleOverlayClick}
        >
          <div className="bg-white border border-gray-200 rounded-xl shadow-2xl p-6 w-[600px] max-h-[90vh] overflow-y-auto relative animate-fadeIn">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-lg text-gray-800">Add Brochure</h4>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Toggle Buttons */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setMode("upload")}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    mode === "upload"
                      ? "bg-teal-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Upload size={14} className="inline mr-1" />
                  Upload Document
                </button>
                <button
                  onClick={() => setMode("text")}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    mode === "text"
                      ? "bg-teal-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <FileText size={14} className="inline mr-1" />
                  Enter Text
                </button>
              </div>

              {/* Upload Mode */}
              {mode === "upload" && (
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id={`brochure-upload-${eventId}`}
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <label
                      htmlFor={`brochure-upload-${eventId}`}
                      className="cursor-pointer"
                    >
                      <Upload className="mx-auto mb-2 text-gray-400" size={28} />
                      <p className="text-sm text-gray-600 mb-1">
                        Click to upload document
                      </p>
                      <p className="text-xs text-gray-400">
                        PDF, DOC, DOCX (max 5MB)
                      </p>
                    </label>
                  </div>

                  {fileName && (
                    <div className="bg-gray-50 rounded p-3 text-sm">
                      <p className="text-gray-700 truncate">
                        <FileText size={14} className="inline mr-1" />
                        {fileName}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Text Mode */}
              {mode === "text" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Brochure Content
                  </label>
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Enter brochure details, description, or information..."
                    className="w-full h-56 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-sm"
                  />
                  <p className="text-xs text-gray-500 text-right">
                    {textContent.length} characters
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={
                    (mode === "upload" && !selectedFile) ||
                    (mode === "text" && !textContent.trim()) ||
                    isUploading
                  }
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  <Save size={16} />
                  <span>{isUploading ? "Saving..." : "Save"}</span>
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isUploading}
                  className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inline CSS for animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BrochureUploadButton;
