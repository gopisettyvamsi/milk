"use client";

import React, { useRef, useEffect, useState } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fontSize, setFontSize] = useState(3);
  const [tableOpacity, setTableOpacity] = useState(0); 

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

  // 👉 Insert custom "info table" block (not real table)
const insertInfoBlock = () => {
  if (!editorRef.current) return;
  const infoBlock = document.createElement("div");
  infoBlock.contentEditable = "true";
  infoBlock.className = "info-block my-2 p-2";

  infoBlock.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:6px;">
      <div style="display:flex; gap:8px; align-items:flex-start;">
        <div style="font-weight:bold; min-width:80px;">Location:</div>
        <div contenteditable="true" style="font-weight:normal;">
          Incub8 startup studios, 1st Floor, Edvenswa Towers, 6-149/5/B/1, Bowrampet, Hyderabad, India
        </div>
      </div>
      <div style="display:flex; gap:8px; align-items:flex-start;">
        <div style="font-weight:bold; min-width:80px;">Date:</div>
        <div contenteditable="true" style="font-weight:normal;">
          5th of September 2025
        </div>
      </div>
    </div>
  `;

  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return;
  const range = sel.getRangeAt(0);
  range.deleteContents();
  range.insertNode(infoBlock);

  onChange(editorRef.current.innerHTML);
};

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  return (
    <div className="w-full p-4 border border-gray-300 rounded-md shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button type="button" onClick={() => execCommand("bold")} className="px-2 py-1 border rounded font-bold">B</button>
        <button type="button" onClick={() => execCommand("italic")} className="px-2 py-1 border rounded italic">I</button>
        <button type="button" onClick={() => execCommand("underline")} className="px-2 py-1 border rounded underline">U</button>
        <button type="button" onClick={() => execCommand("insertUnorderedList")} className="px-2 py-1 border rounded">• List</button>
        <button type="button" onClick={() => execCommand("insertOrderedList")} className="px-2 py-1 border rounded">1. List</button>
        <button type="button" onClick={() => fileInputRef.current?.click()} className="px-2 py-1 border rounded">📷 Image</button>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} hidden />

        {/* Font size controls */}
        <button type="button" onClick={decreaseFontSize} className="px-2 py-1 border rounded">A-</button>
        <button type="button" onClick={increaseFontSize} className="px-2 py-1 border rounded">A+</button>

        {/* Text & BG colors */}
        <label className="flex items-center gap-1 cursor-pointer">
          <span className="text-sm">Text</span>
          <input type="color" onChange={(e) => {editorRef.current?.focus(); execCommand("foreColor", e.target.value);}} className="w-8 h-6 p-0 border rounded cursor-pointer"/>
        </label>
        <label className="flex items-center gap-1 cursor-pointer">
          <span className="text-sm">BG</span>
          <input type="color" onChange={(e) => {editorRef.current?.focus(); execCommand("hiliteColor", e.target.value);}} className="w-8 h-6 p-0 border rounded cursor-pointer"/>
        </label>

        {/* Insert Info Block */}
        <button type="button" onClick={insertInfoBlock} className="px-2 py-1 border rounded">+ Info</button>
      </div>

      <div className="pb-3">
      <button type="button" onClick={() => { if (editorRef.current) { editorRef.current.innerHTML = ""; onChange(""); }}} className="px-2 py-1 border rounded text-red-600 font-semibold">
          Clear
      </button>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[150px] p-3 border border-gray-300 rounded-md focus:outline-none
             [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-black
             [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:text-black"
        onInput={handleInput}
      />
    </div>
  );
};

export default RichTextEditor;
