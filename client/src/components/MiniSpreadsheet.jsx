/**
 * Mini Spreadsheet Component
 * Interactive Excel grid simulator for hands-on practice within lessons
 */

import React, { useState, useCallback } from 'react';

const MiniSpreadsheet = ({ 
  rows = 6, 
  cols = 4, 
  initialData = {}, 
  editableCells = null, // null means all editable
  highlightCells = [],
  targetValues = {}, // { "A1": "Hello" } for checking answers
  instructions = '',
  onComplete = () => {}
}) => {
  const [cellData, setCellData] = useState(initialData);
  const [selectedCell, setSelectedCell] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);

  const getColLabel = (index) => String.fromCharCode(65 + index);
  const getCellId = (row, col) => `${getColLabel(col)}${row + 1}`;

  const isEditable = (row, col) => {
    if (editableCells === null) return true;
    return editableCells.includes(getCellId(row, col));
  };

  const isHighlighted = (row, col) => {
    return highlightCells.includes(getCellId(row, col));
  };

  const evaluateFormula = useCallback((formula, data) => {
    if (!formula.startsWith('=')) return formula;
    
    const expr = formula.substring(1).toUpperCase();
    
    // Handle SUM(range)
    const sumMatch = expr.match(/^SUM\(([A-Z])(\d+):([A-Z])(\d+)\)$/);
    if (sumMatch) {
      const [, startCol, startRow, endCol, endRow] = sumMatch;
      let sum = 0;
      for (let r = parseInt(startRow); r <= parseInt(endRow); r++) {
        for (let c = startCol.charCodeAt(0); c <= endCol.charCodeAt(0); c++) {
          const cellId = `${String.fromCharCode(c)}${r}`;
          const val = parseFloat(data[cellId]) || 0;
          sum += val;
        }
      }
      return sum;
    }
    
    // Handle simple cell references for addition
    const addMatch = expr.match(/^([A-Z]\d+)\+([A-Z]\d+)$/);
    if (addMatch) {
      const val1 = parseFloat(data[addMatch[1]]) || 0;
      const val2 = parseFloat(data[addMatch[2]]) || 0;
      return val1 + val2;
    }

    // Handle MIN/MAX
    const minMaxMatch = expr.match(/^(MIN|MAX)\(([A-Z])(\d+):([A-Z])(\d+)\)$/);
    if (minMaxMatch) {
      const [, fn, startCol, startRow, endCol, endRow] = minMaxMatch;
      const values = [];
      for (let r = parseInt(startRow); r <= parseInt(endRow); r++) {
        for (let c = startCol.charCodeAt(0); c <= endCol.charCodeAt(0); c++) {
          const cellId = `${String.fromCharCode(c)}${r}`;
          const val = parseFloat(data[cellId]);
          if (!isNaN(val)) values.push(val);
        }
      }
      if (values.length === 0) return 0;
      return fn === 'MIN' ? Math.min(...values) : Math.max(...values);
    }

    return formula;
  }, []);

  const getCellDisplay = (row, col) => {
    const cellId = getCellId(row, col);
    const value = cellData[cellId];
    if (!value) return '';
    if (typeof value === 'string' && value.startsWith('=')) {
      return evaluateFormula(value, cellData);
    }
    return value;
  };

  const handleCellClick = (row, col) => {
    const cellId = getCellId(row, col);
    setSelectedCell(cellId);
    if (isEditable(row, col)) {
      setEditingCell(cellId);
      setEditValue(cellData[cellId] || '');
    }
  };

  const handleCellSubmit = () => {
    if (editingCell) {
      const newData = { ...cellData, [editingCell]: editValue };
      setCellData(newData);
      setEditingCell(null);
      
      // Check if all target values are met
      if (Object.keys(targetValues).length > 0) {
        let correct = 0;
        let total = Object.keys(targetValues).length;
        
        for (const [cellId, expected] of Object.entries(targetValues)) {
          const actual = newData[cellId] || '';
          const displayValue = typeof actual === 'string' && actual.startsWith('=') 
            ? String(evaluateFormula(actual, newData))
            : String(actual);
          
          if (displayValue.toLowerCase().trim() === String(expected).toLowerCase().trim() ||
              actual.toLowerCase().trim() === String(expected).toLowerCase().trim()) {
            correct++;
          }
        }
        
        setCorrectCount(correct);
        if (correct === total) {
          setIsCorrect(true);
          onComplete();
        }
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCellSubmit();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  const totalTargets = Object.keys(targetValues).length;

  return (
    <div className="bg-dark-surface rounded-xl p-4 border border-baby-pink/20">
      {instructions && (
        <div className="mb-4 p-3 bg-dark-card rounded-lg border border-baby-pink/10">
          <p className="text-baby-pink font-semibold text-sm mb-1">📋 Task:</p>
          <p className="text-gray-300 text-sm">{instructions}</p>
        </div>
      )}

      {/* Formula Bar */}
      <div className="flex items-center gap-2 mb-3">
        <div className="bg-dark-card border border-dark-border rounded px-3 py-1 text-baby-pink font-mono text-sm min-w-[50px] text-center">
          {selectedCell || 'A1'}
        </div>
        <div className="flex-1 bg-dark-card border border-dark-border rounded px-3 py-1 text-gray-300 font-mono text-sm">
          {selectedCell ? (cellData[selectedCell] || '') : ''}
        </div>
      </div>

      {/* Spreadsheet Grid */}
      <div className="overflow-x-auto rounded-lg border border-dark-border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="bg-dark-card border border-dark-border p-2 w-10 text-gray-500 text-xs"></th>
              {Array.from({ length: cols }).map((_, c) => (
                <th key={c} className="bg-dark-card border border-dark-border p-2 text-baby-pink/70 font-bold text-xs min-w-[80px]">
                  {getColLabel(c)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, r) => (
              <tr key={r}>
                <td className="bg-dark-card border border-dark-border p-2 text-center text-baby-pink/70 font-bold text-xs">
                  {r + 1}
                </td>
                {Array.from({ length: cols }).map((_, c) => {
                  const cellId = getCellId(r, c);
                  const isSelected = selectedCell === cellId;
                  const isEditing = editingCell === cellId;
                  const cellEditable = isEditable(r, c);
                  const highlighted = isHighlighted(r, c);
                  
                  return (
                    <td
                      key={c}
                      onClick={() => handleCellClick(r, c)}
                      className={`border border-dark-border p-0 cursor-pointer relative ${
                        isSelected ? 'ring-2 ring-baby-pink' : ''
                      } ${highlighted ? 'bg-baby-pink/10' : 'bg-dark-card'} ${
                        !cellEditable ? 'bg-dark-surface/50' : 'hover:bg-dark-hover'
                      } ${
                        targetValues[cellId] && String(getCellDisplay(r, c)).toLowerCase().trim() === String(targetValues[cellId]).toLowerCase().trim()
                          ? 'bg-green-900/20' : ''
                      }`}
                    >
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleCellSubmit}
                          onKeyDown={handleKeyDown}
                          autoFocus
                          className="w-full h-full bg-dark-card text-white px-2 py-1 outline-none font-mono text-sm border-none"
                        />
                      ) : (
                        <div className="px-2 py-1 text-gray-300 font-mono text-sm min-h-[28px]">
                          {getCellDisplay(r, c)}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Progress & Result */}
      {totalTargets > 0 && (
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-32 bg-dark-card rounded-full h-2">
              <div 
                className="bg-baby-pink h-2 rounded-full transition-all" 
                style={{ width: `${(correctCount / totalTargets) * 100}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-500">{correctCount}/{totalTargets} correct</span>
          </div>
          {isCorrect && (
            <span className="text-baby-pink font-bold text-sm animate-bounce">
              ✨ Perfect! +10 XP
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default MiniSpreadsheet;
