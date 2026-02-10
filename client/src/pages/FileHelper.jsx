/**
 * File Helper Page Component
 * Allows users to upload Excel files and get AI-powered analysis
 */

import React, { useState } from 'react';
import axios from 'axios';
import FileUploader from '../components/FileUploader';
import { API_BASE_URL } from '../config/api';

const FileHelper = () => {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setAnalysis(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/ai/analyze-file`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setAnalysis(response.data);
    } catch (error) {
      console.error('Error analyzing file:', error);
      setError(error.response?.data?.message || 'Failed to analyze file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-baby-pink mb-6">
        📤 Excel File Helper
      </h1>

      <div className="bg-dark-card rounded-xl p-6 border border-dark-border mb-6">
        <h2 className="text-2xl font-bold text-baby-pink mb-4">
          How It Works
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-lg text-gray-300">
          <li>Upload your Excel file (.xlsx or .xls)</li>
          <li>Our AI will analyze the file structure, data, and formulas</li>
          <li>Get a beginner-friendly explanation of what's in your file</li>
          <li>Receive helpful tips and suggestions for improvement</li>
        </ol>
      </div>

      {/* File Upload */}
      <div className="bg-dark-card rounded-xl p-6 border border-dark-border mb-6">
        <h2 className="text-2xl font-bold text-baby-pink mb-4">
          Upload Your Excel File
        </h2>
        <FileUploader onFileSelect={handleFileSelect} />
        
        {file && (
          <div className="mt-4 p-4 bg-dark-surface rounded-lg border border-baby-pink/20">
            <p className="text-lg font-semibold text-baby-pink">
              Selected: {file.name}
            </p>
            <p className="text-sm text-gray-500">
              Size: {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={!file || loading}
          className="mt-4 w-full px-6 py-4 bg-baby-pink text-black rounded-lg font-bold text-xl hover:bg-baby-pink-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-pink-glow"
        >
          {loading ? 'Analyzing...' : '🔍 Analyze File'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/30 border-2 border-red-500/50 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold text-red-400 mb-2">
            ⚠️ Error
          </h3>
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
            <h2 className="text-2xl font-bold text-baby-pink mb-4">
              📊 File Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-dark-surface rounded-lg p-4 text-center border border-baby-pink/20">
                <div className="text-3xl font-bold text-baby-pink">
                  {analysis.summary.totalSheets}
                </div>
                <div className="text-gray-400">Sheet(s)</div>
              </div>
              <div className="bg-dark-surface rounded-lg p-4 text-center border border-baby-pink/20">
                <div className="text-3xl font-bold text-baby-pink">
                  {analysis.summary.totalRows}
                </div>
                <div className="text-gray-400">Total Rows</div>
              </div>
              <div className="bg-dark-surface rounded-lg p-4 text-center border border-baby-pink/20">
                <div className="text-3xl font-bold text-baby-pink">
                  {analysis.summary.totalFormulas}
                </div>
                <div className="text-gray-400">Formula(s)</div>
              </div>
            </div>
          </div>

          {/* AI Explanation */}
          <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
            <h2 className="text-2xl font-bold text-baby-pink mb-4">
              🤖 AI Explanation
            </h2>
            <div className="prose max-w-none text-lg text-gray-300 whitespace-pre-wrap">
              {analysis.explanation}
            </div>
          </div>

          {/* File Structure Details */}
          <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
            <h2 className="text-2xl font-bold text-baby-pink mb-4">
              📋 File Structure
            </h2>
            {analysis.fileInfo.sheets.map((sheet, index) => (
              <div key={index} className="mb-6 last:mb-0 border-b border-dark-border pb-6 last:border-b-0">
                <h3 className="text-xl font-bold text-white mb-3">
                  Sheet: {sheet.name}
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4 text-gray-300">
                  <div>
                    <span className="font-semibold">Rows: </span>
                    {sheet.rowCount}
                  </div>
                  <div>
                    <span className="font-semibold">Columns: </span>
                    {sheet.colCount}
                  </div>
                </div>
                
                {sheet.headers.length > 0 && (
                  <div className="mb-4 text-gray-300">
                    <span className="font-semibold">Columns: </span>
                    <span>{sheet.headers.join(', ')}</span>
                  </div>
                )}

                {sheet.formulas.length > 0 && (
                  <div className="mb-4">
                    <span className="font-semibold text-gray-300">Formulas Found: </span>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {sheet.formulas.map((formula, idx) => (
                        <li key={idx} className="text-gray-400">
                          <code className="bg-dark-surface px-2 py-1 rounded text-baby-pink">
                            {formula.cell}: {formula.formula}
                          </code>
                          {' = '}
                          {formula.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {sheet.sampleData.length > 0 && (
                  <div>
                    <span className="font-semibold text-gray-300">Sample Data (first few rows):</span>
                    <div className="overflow-x-auto mt-2 rounded-lg border border-dark-border">
                      <table className="min-w-full border-collapse">
                        <thead>
                          <tr className="bg-baby-pink">
                            {sheet.headers.map((header, idx) => (
                              <th key={idx} className="border border-baby-pink-dark/30 p-2 text-left text-black font-bold">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sheet.sampleData.slice(1, 6).map((row, rowIdx) => (
                            <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-dark-card' : 'bg-dark-surface'}>
                              {row.map((cell, cellIdx) => (
                                <td key={cellIdx} className="border border-dark-border p-2 text-gray-300">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileHelper;
