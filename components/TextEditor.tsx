"use client";

import React, { useRef, useEffect, useState } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

const TextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fontSize, setFontSize] = useState(3); // Default size

  const execCommand = (command: string, val?: string) => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertImageAtCursor = (base64: string) => {
    const img = document.createElement("img");
    img.src = base64;
    img.alt = "Uploaded Image";
    img.style.maxWidth = "100%";

    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;

    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(img);

    // Move cursor after the image
    const space = document.createTextNode(" ");
    range.insertNode(space);
    range.setStartAfter(space);
    range.setEndAfter(space);
    sel.removeAllRanges();
    sel.addRange(range);

    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        insertImageAtCursor(reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const increaseFontSize = () => {
    if (fontSize < 7) {
      const newSize = fontSize + 1;
      setFontSize(newSize);
      execCommand("fontSize", newSize.toString());
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 1) {
      const newSize = fontSize - 1;
      setFontSize(newSize);
      execCommand("fontSize", newSize.toString());
    }
  };

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  return (
    <div className="w-full max-w-2xl p-4 border border-gray-300 rounded-md shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button onClick={() => execCommand("bold")} className="px-2 py-1 border rounded font-bold">B</button>
        <button onClick={() => execCommand("italic")} className="px-2 py-1 border rounded italic">I</button>
        <button onClick={() => execCommand("underline")} className="px-2 py-1 border rounded underline">U</button>
        {/* <button onClick={() => execCommand("insertUnorderedList")} className="px-2 py-1 border rounded">• List</button> */}
        {/* <button onClick={() => execCommand("insertOrderedList")} className="px-2 py-1 border rounded">1. List</button> */}
        {/* <button onClick={() => fileInputRef.current?.click()} className="px-2 py-1 border rounded">📷 Image</button> */}
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} hidden />

        {/* Font size controls */}
        <button onClick={decreaseFontSize} className="px-2 py-1 border rounded">A-</button>
        <button onClick={increaseFontSize} className="px-2 py-1 border rounded">A+</button>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[150px] p-3 border border-gray-300 rounded-md focus:outline-none"
        onInput={handleInput}
      />
    </div>
  );
};

export default TextEditor;
