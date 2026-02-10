/**
 * File Uploader Component
 * Drag-and-drop file upload interface
 */

import React, { useRef, useState } from 'react';

const FileUploader = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        onFileSelect(file);
      } else {
        alert('Please upload an Excel file (.xlsx or .xls)');
      }
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`border-4 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
        isDragging
          ? 'border-baby-pink bg-baby-pink/10 shadow-pink-glow'
          : 'border-dark-border hover:border-baby-pink/50 hover:bg-dark-surface'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileInput}
        className="hidden"
      />
      <div className="text-6xl mb-4">📁</div>
      <p className="text-xl font-semibold text-baby-pink mb-2">
        {isDragging ? 'Drop your file here!' : 'Click or drag your Excel file here'}
      </p>
      <p className="text-gray-500">
        Supports .xlsx and .xls files
      </p>
    </div>
  );
};

export default FileUploader;
