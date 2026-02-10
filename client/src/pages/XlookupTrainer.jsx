/**
 * XLOOKUP Trainer Page Component
 * Interactive XLOOKUP learning tool with visual sandbox
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const XlookupTrainer = () => {
  const [tableData, setTableData] = useState([]);
  const [lookupValue, setLookupValue] = useState('');
  const [columnIndex, setColumnIndex] = useState(2);
  const [rangeLookup, setRangeLookup] = useState(false);
  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState([]);
  const [matchedRow, setMatchedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataType, setDataType] = useState('employees');

  useEffect(() => {
    const fetchSampleData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/xlookup/sample-data`);
        const data = dataType === 'employees' ? response.data?.employees : response.data?.products;
        
        if (!data || !Array.isArray(data)) {
          console.error('Invalid data format received:', response.data);
          return;
        }
        
        if (dataType === 'employees') {
          setTableData([
            ['Employee ID', 'Name', 'Department', 'Salary'],
            ...data.map(emp => [emp.id, emp.name, emp.department, emp.salary])
          ]);
        } else {
          setTableData([
            ['Product Code', 'Name', 'Price', 'Category'],
            ...data.map(prod => [prod.code, prod.name, prod.price, prod.category])
          ]);
        }
      } catch (error) {
        console.error('Error fetching sample data:', error);
        setTableData([['Error', 'Loading', 'Failed', 'Please refresh']]);
      }
    };
    
    fetchSampleData();
  }, [dataType]);

  const handleExecute = async () => {
    if (!lookupValue) {
      alert('Please enter a lookup value');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/xlookup/execute`, {
        lookupValue,
        tableData: tableData.slice(1),
        columnIndex,
        rangeLookup
      });
      
      setResult(response.data.result);
      setSteps(response.data.steps);
      setMatchedRow(response.data.matchedRow);
    } catch (error) {
      console.error('Error executing XLOOKUP:', error);
      alert('Error executing XLOOKUP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getColumnLabel = (index) => {
    return String.fromCharCode(64 + index);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-baby-pink mb-6">
        🔍 XLOOKUP Trainer
      </h1>

      {/* Explanation Section */}
      <div className="bg-dark-card rounded-xl p-6 border border-dark-border mb-6">
        <h2 className="text-2xl font-bold text-baby-pink mb-4">
          What is XLOOKUP?
        </h2>
        <p className="text-lg text-gray-300 mb-4">
          XLOOKUP is like a smart search function in Excel. It looks for a value in a table, 
          then returns a value from another column in the same row.
        </p>
        <div className="bg-dark-surface p-4 rounded-lg border border-baby-pink/20">
          <p className="font-semibold text-baby-pink mb-2">
            Formula: =XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-1">
            <li><strong className="text-gray-300">lookup_value:</strong> What you're searching for</li>
            <li><strong className="text-gray-300">lookup_array:</strong> The column/array where you're searching</li>
            <li><strong className="text-gray-300">return_array:</strong> The column/array from which to return values</li>
            <li><strong className="text-gray-300">if_not_found:</strong> Optional - what to return if not found</li>
            <li><strong className="text-gray-300">match_mode:</strong> Optional - exact match, exact or smaller, etc.</li>
            <li><strong className="text-gray-300">search_mode:</strong> Optional - search first-to-last or last-to-first</li>
          </ul>
        </div>
      </div>

      {/* Data Type Selector */}
      <div className="bg-dark-card rounded-xl p-6 border border-dark-border mb-6">
        <label className="block text-lg font-semibold text-gray-300 mb-3">
          Choose Example Data:
        </label>
        <div className="flex gap-4">
          <button
            onClick={() => setDataType('employees')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              dataType === 'employees'
                ? 'bg-baby-pink text-black shadow-pink-glow'
                : 'bg-dark-surface text-gray-300 border border-dark-border hover:border-baby-pink/50'
            }`}
          >
            👥 Employees
          </button>
          <button
            onClick={() => setDataType('products')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              dataType === 'products'
                ? 'bg-baby-pink text-black shadow-pink-glow'
                : 'bg-dark-surface text-gray-300 border border-dark-border hover:border-baby-pink/50'
            }`}
          >
            📦 Products
          </button>
        </div>
      </div>

      {/* Interactive Sandbox */}
      <div className="bg-dark-card rounded-xl p-6 border border-dark-border mb-6">
        <h2 className="text-2xl font-bold text-baby-pink mb-4">
          Interactive XLOOKUP Sandbox
        </h2>

        {/* Input Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-lg font-semibold text-gray-300 mb-2">
              Lookup Value (what to search for):
            </label>
            <input
              type="text"
              value={lookupValue}
              onChange={(e) => setLookupValue(e.target.value)}
              placeholder={dataType === 'employees' ? 'E.g., E001' : 'E.g., P101'}
              className="w-full px-4 py-3 bg-dark-surface border-2 border-dark-border rounded-lg text-lg text-white focus:outline-none focus:border-baby-pink placeholder-gray-600"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-300 mb-2">
              Column Index (which column to return):
            </label>
            <select
              value={columnIndex}
              onChange={(e) => setColumnIndex(parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-dark-surface border-2 border-dark-border rounded-lg text-lg text-white focus:outline-none focus:border-baby-pink"
            >
              <option value={1}>1 - {tableData[0]?.[0] || 'Column 1'}</option>
              <option value={2}>2 - {tableData[0]?.[1] || 'Column 2'}</option>
              <option value={3}>3 - {tableData[0]?.[2] || 'Column 3'}</option>
              <option value={4}>4 - {tableData[0]?.[3] || 'Column 4'}</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-lg font-semibold text-gray-300 mb-2">
              Range Lookup:
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setRangeLookup(false)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  !rangeLookup
                    ? 'bg-baby-pink text-black shadow-pink-glow'
                    : 'bg-dark-surface text-gray-300 border border-dark-border hover:border-baby-pink/50'
                }`}
              >
                FALSE (Exact Match)
              </button>
              <button
                onClick={() => setRangeLookup(true)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  rangeLookup
                    ? 'bg-baby-pink text-black shadow-pink-glow'
                    : 'bg-dark-surface text-gray-300 border border-dark-border hover:border-baby-pink/50'
                }`}
              >
                TRUE (Approximate Match)
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleExecute}
          disabled={loading || !lookupValue}
          className="w-full px-6 py-4 bg-baby-pink text-black rounded-lg font-bold text-xl hover:bg-baby-pink-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6 shadow-pink-glow"
        >
          {loading ? 'Running XLOOKUP...' : '🚀 Run XLOOKUP'}
        </button>

        {/* Data Table */}
        <div className="overflow-x-auto mb-6 rounded-lg border border-dark-border">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-baby-pink">
                {tableData[0]?.map((header, index) => (
                  <th
                    key={index}
                    className={`border border-baby-pink-dark/30 p-3 text-left font-bold text-black ${
                      index + 1 === columnIndex ? 'bg-baby-pink-dark' : ''
                    }`}
                  >
                    {getColumnLabel(index + 1)}: {header}
                    {index + 1 === columnIndex && ' ← Return Column'}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.slice(1).map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`${
                    matchedRow === rowIndex
                      ? 'bg-baby-pink/20 font-bold'
                      : rowIndex % 2 === 0
                      ? 'bg-dark-card'
                      : 'bg-dark-surface'
                  }`}
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`border border-dark-border p-3 text-gray-300 ${
                        cellIndex === 0 && String(cell).toLowerCase() === String(lookupValue).toLowerCase()
                          ? 'bg-green-900/30 text-green-300'
                          : ''
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Result Display */}
        {result !== null && (
          <div className="bg-dark-surface rounded-lg p-6 border border-baby-pink/30">
            <h3 className="text-xl font-bold text-baby-pink mb-3">
              Result:
            </h3>
            <div className="text-3xl font-bold text-white mb-4">
              {result !== null ? (result || '#N/A') : '—'}
            </div>
            
            {steps.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-300 mb-2">
                  Steps:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  {steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default XlookupTrainer;
