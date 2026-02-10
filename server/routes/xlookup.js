/**
 * XLOOKUP API Routes
 * Handles XLOOKUP trainer endpoints
 */

const express = require('express');
const router = express.Router();

// Get sample data for XLOOKUP practice
router.get('/sample-data', (req, res) => {
  // Sample employee data for XLOOKUP practice
  const sampleData = {
    employees: [
      { id: 'E001', name: 'Alice Johnson', department: 'Sales', salary: 55000 },
      { id: 'E002', name: 'Bob Smith', department: 'Marketing', salary: 62000 },
      { id: 'E003', name: 'Carol White', department: 'Sales', salary: 58000 },
      { id: 'E004', name: 'David Brown', department: 'IT', salary: 75000 },
      { id: 'E005', name: 'Emma Davis', department: 'HR', salary: 52000 }
    ],
    products: [
      { code: 'P101', name: 'Laptop', price: 999.99, category: 'Electronics' },
      { code: 'P102', name: 'Mouse', price: 29.99, category: 'Electronics' },
      { code: 'P103', name: 'Desk Chair', price: 199.99, category: 'Furniture' },
      { code: 'P104', name: 'Monitor', price: 299.99, category: 'Electronics' },
      { code: 'P105', name: 'Keyboard', price: 79.99, category: 'Electronics' }
    ]
  };
  
  res.json(sampleData);
});

// Execute XLOOKUP simulation
router.post('/execute', (req, res) => {
  const { lookupValue, tableData, columnIndex, rangeLookup } = req.body;
  
  // XLOOKUP simulation logic
  // rangeLookup: true = approximate match, false = exact match
  const exactMatch = rangeLookup === false;
  
  let result = null;
  let matchedRow = null;
  let steps = [];
  
  // Find matching row
  for (let i = 0; i < tableData.length; i++) {
    const row = tableData[i];
    const firstColumnValue = row[0];
    
    if (exactMatch) {
      // Exact match
      if (String(firstColumnValue).toLowerCase() === String(lookupValue).toLowerCase()) {
        matchedRow = i;
        result = row[columnIndex - 1]; // columnIndex is 1-based
        steps.push(`Found exact match in row ${i + 1}: "${firstColumnValue}"`);
        break;
      } else {
        steps.push(`Checked row ${i + 1}: "${firstColumnValue}" - no match`);
      }
    } else {
      // Approximate match (simplified - would need sorted data in real Excel)
      if (String(firstColumnValue).toLowerCase() === String(lookupValue).toLowerCase()) {
        matchedRow = i;
        result = row[columnIndex - 1];
        steps.push(`Found match in row ${i + 1}: "${firstColumnValue}"`);
        break;
      }
    }
  }
  
  if (result === null && exactMatch) {
    steps.push('No exact match found. XLOOKUP returns #N/A error.');
  }
  
  res.json({
    result,
    matchedRow,
    steps,
    success: result !== null
  });
});

module.exports = router;

