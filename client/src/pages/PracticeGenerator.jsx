/**
 * Practice Sheet Generator Page Component
 * Generates downloadable Excel practice sheets
 */

import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const PracticeGenerator = () => {
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sheetTypes = [
    {
      id: 'data-entry',
      title: '📝 Easy Data Entry Sheet',
      description: 'Practice entering data into cells. Includes sample data and empty rows for you to fill in.',
      icon: '📝'
    },
    {
      id: 'sum',
      title: '➕ SUM Practice Sheet',
      description: 'Learn to use SUM formulas with a shopping list example. Practice adding numbers automatically.',
      icon: '➕'
    },
    {
      id: 'sorting',
      title: '🔀 Sorting Practice',
      description: 'Practice sorting data by different columns (name, department, salary).',
      icon: '🔀'
    },
    {
      id: 'xlookup',
      title: '🔍 XLOOKUP Practice Table',
      description: 'Ready-to-use XLOOKUP examples with product codes and lookup formulas.',
      icon: '🔍'
    },
    {
      id: 'budget',
      title: '💰 Budget Template',
      description: 'A simple monthly budget template with income, expenses, and automatic calculations.',
      icon: '💰'
    }
  ];

  const handleGenerate = async () => {
    if (!selectedType) {
      alert('Please select a practice sheet type');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/ai/generate-sheet`,
        {
          sheetType: selectedType,
          options: {}
        },
        {
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'practice_sheet.xlsx';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating sheet:', error);
      let errorMessage = 'Failed to generate practice sheet. Please try again.';
      
      if (error.response) {
        if (error.response.status === 405) {
          errorMessage = 'Method not allowed. Please check if the server is running correctly.';
        } else if (error.response.data) {
          errorMessage = error.response.data.message || error.response.data.error || errorMessage;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-baby-pink mb-6">
        🧪 AI Practice Sheet Generator
      </h1>

      <div className="bg-dark-card rounded-xl p-6 border border-dark-border mb-6">
        <h2 className="text-2xl font-bold text-baby-pink mb-4">
          How It Works
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-lg text-gray-300">
          <li>Choose a practice sheet type below</li>
          <li>Click "Generate & Download"</li>
          <li>Open the downloaded file in Excel</li>
          <li>Follow the instructions in the sheet to practice!</li>
        </ol>
      </div>

      {/* Sheet Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {sheetTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            className={`bg-dark-card rounded-xl p-6 text-left transition-all duration-300 transform hover:scale-105 border-2 ${
              selectedType === type.id
                ? 'border-baby-pink shadow-pink-glow'
                : 'border-dark-border hover:border-baby-pink/50'
            }`}
          >
            <div className="text-4xl mb-3">{type.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2">
              {type.title}
            </h3>
            <p className="text-gray-400">
              {type.description}
            </p>
            {selectedType === type.id && (
              <div className="mt-4 text-baby-pink font-semibold">
                ✓ Selected
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Generate Button */}
      <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
        <button
          onClick={handleGenerate}
          disabled={!selectedType || loading}
          className="w-full px-6 py-4 bg-baby-pink text-black rounded-lg font-bold text-xl hover:bg-baby-pink-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-pink-glow"
        >
          {loading ? 'Generating...' : '🚀 Generate & Download'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-6 bg-red-900/30 border-2 border-red-500/50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-red-400 mb-2">
            ⚠️ Error
          </h3>
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 bg-dark-surface rounded-xl p-6 border border-baby-pink/20">
        <h2 className="text-xl font-bold text-baby-pink mb-3">
          💡 Tips
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-400">
          <li>All practice sheets include instructions on how to use them</li>
          <li>Feel free to modify the data and experiment!</li>
          <li>If you make a mistake, just download a new copy</li>
          <li>Try different practice sheets to learn various Excel skills</li>
        </ul>
      </div>
    </div>
  );
};

export default PracticeGenerator;
