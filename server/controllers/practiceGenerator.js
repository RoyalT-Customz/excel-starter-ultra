/**
 * Practice Sheet Generator Controller
 * Generates Excel practice sheets using AI and xlsx library
 */

const XLSX = require('xlsx');
const OpenAI = require('openai');
const path = require('path');
const fs = require('fs');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

/**
 * Generate a practice Excel sheet
 * @param {string} sheetType - Type of practice sheet to generate
 * @param {Object} options - Additional options for sheet generation
 * @returns {Promise<Object>} Generated sheet file info
 */
async function generateSheet(sheetType, options = {}) {
  try {
    let workbook;
    let filename;
    
    switch (sheetType) {
      case 'data-entry':
        workbook = generateDataEntrySheet();
        filename = 'Data_Entry_Practice.xlsx';
        break;
        
      case 'sum':
        workbook = generateSumSheet();
        filename = 'SUM_Practice.xlsx';
        break;
        
      case 'sorting':
        workbook = generateSortingSheet();
        filename = 'Sorting_Practice.xlsx';
        break;
        
      case 'xlookup':
        workbook = generateXlookupSheet();
        filename = 'XLOOKUP_Practice.xlsx';
        break;
        
      case 'budget':
        workbook = generateBudgetSheet();
        filename = 'Budget_Template.xlsx';
        break;
        
      default:
        throw new Error(`Unknown sheet type: ${sheetType}`);
    }
    
    // Generate file buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    return {
      buffer,
      filename,
      filePath: null // Not saving to disk, sending directly
    };
  } catch (error) {
    console.error('Sheet generation error:', error);
    throw new Error(`Failed to generate sheet: ${error.message}`);
  }
}

/**
 * Generate a simple data entry practice sheet
 */
function generateDataEntrySheet() {
  const wb = XLSX.utils.book_new();
  
  const data = [
    ['Name', 'Age', 'City', 'Favorite Color'],
    ['Alice', 25, 'New York', 'Blue'],
    ['Bob', 30, 'Los Angeles', 'Green'],
    ['Carol', 28, 'Chicago', 'Red'],
    ['', '', '', ''], // Empty rows for practice
    ['', '', '', ''],
    ['', '', '', ''],
    ['Instructions:', '', '', ''],
    ['1. Fill in the empty rows with your own data', '', '', ''],
    ['2. Try entering different types of data (text, numbers)', '', '', ''],
    ['3. Practice using Tab and Enter keys to move between cells', '', '', '']
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(data);
  
  // Set column widths
  ws['!cols'] = [
    { wch: 15 },
    { wch: 10 },
    { wch: 15 },
    { wch: 15 }
  ];
  
  XLSX.utils.book_append_sheet(wb, ws, 'Data Entry Practice');
  return wb;
}

/**
 * Generate SUM practice sheet
 */
function generateSumSheet() {
  const wb = XLSX.utils.book_new();
  
  const data = [
    ['Item', 'Price'],
    ['Apple', 1.50],
    ['Banana', 0.75],
    ['Orange', 1.25],
    ['Grapes', 3.00],
    ['Strawberries', 4.50],
    ['', ''],
    ['Total:', '=SUM(B2:B6)'],
    ['', ''],
    ['Instructions:', ''],
    ['1. Try changing the prices and watch the SUM formula update automatically', ''],
    ['2. Add more items in the empty rows', ''],
    ['3. Practice using the SUM formula in different cells', ''],
    ['4. Try using AutoSum button (Alt + =) to create new SUM formulas', '']
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 20 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, ws, 'SUM Practice');
  return wb;
}

/**
 * Generate sorting practice sheet
 */
function generateSortingSheet() {
  const wb = XLSX.utils.book_new();
  
  const data = [
    ['Employee', 'Department', 'Salary'],
    ['Alice Johnson', 'Sales', 55000],
    ['Bob Smith', 'Marketing', 62000],
    ['Carol White', 'Sales', 58000],
    ['David Brown', 'IT', 75000],
    ['Emma Davis', 'HR', 52000],
    ['Frank Miller', 'IT', 70000],
    ['', '', ''],
    ['Instructions:', '', ''],
    ['1. Select all the data (including headers)', '', ''],
    ['2. Go to Data tab → Sort', '', ''],
    ['3. Try sorting by Name, Department, or Salary', '', ''],
    ['4. Practice using both A-Z and Z-A sorting', '', '']
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 18 }, { wch: 15 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Sorting Practice');
  return wb;
}

/**
 * Generate XLOOKUP practice sheet
 */
function generateXlookupSheet() {
  const wb = XLSX.utils.book_new();
  
  // First sheet: Lookup table
  const lookupTable = [
    ['Product Code', 'Product Name', 'Price', 'Category'],
    ['P101', 'Laptop', 999.99, 'Electronics'],
    ['P102', 'Mouse', 29.99, 'Electronics'],
    ['P103', 'Desk Chair', 199.99, 'Furniture'],
    ['P104', 'Monitor', 299.99, 'Electronics'],
    ['P105', 'Keyboard', 79.99, 'Electronics']
  ];
  
  const ws1 = XLSX.utils.aoa_to_sheet(lookupTable);
  ws1['!cols'] = [{ wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, ws1, 'Product List');
  
  // Second sheet: XLOOKUP practice
  const xlookupPractice = [
    ['Product Code', 'Product Name', 'Price'],
    ['P101', '=XLOOKUP(A2,Product List!A:A,Product List!B:B)', '=XLOOKUP(A2,Product List!A:A,Product List!C:C)'],
    ['P102', '=XLOOKUP(A3,Product List!A:A,Product List!B:B)', '=XLOOKUP(A3,Product List!A:A,Product List!C:C)'],
    ['P103', '=XLOOKUP(A4,Product List!A:A,Product List!B:B)', '=XLOOKUP(A4,Product List!A:A,Product List!C:C)'],
    ['', '', ''],
    ['Instructions:', '', ''],
    ['1. The formulas are already set up for you', '', ''],
    ['2. Try changing the Product Code in column A', '', ''],
    ['3. Watch how XLOOKUP finds the matching product', '', ''],
    ['4. Try entering a new product code like P104 or P105', '', '']
  ];
  
  const ws2 = XLSX.utils.aoa_to_sheet(xlookupPractice);
  ws2['!cols'] = [{ wch: 15 }, { wch: 20 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, ws2, 'XLOOKUP Practice');
  
  return wb;
}

/**
 * Generate budget template
 */
function generateBudgetSheet() {
  const wb = XLSX.utils.book_new();
  
  const data = [
    ['Monthly Budget', '', ''],
    ['', '', ''],
    ['Income', '', ''],
    ['Salary', 3000, ''],
    ['Other Income', 0, ''],
    ['Total Income', '=SUM(B4:B5)', ''],
    ['', '', ''],
    ['Expenses', '', ''],
    ['Rent', 1000, ''],
    ['Groceries', 400, ''],
    ['Transportation', 200, ''],
    ['Utilities', 150, ''],
    ['Entertainment', 100, ''],
    ['Other', 0, ''],
    ['Total Expenses', '=SUM(B9:B14)', ''],
    ['', '', ''],
    ['Remaining', '=B6-B15', ''],
    ['', '', ''],
    ['Instructions:', '', ''],
    ['1. Fill in your actual income and expenses', '', ''],
    ['2. Add more expense categories if needed', '', ''],
    ['3. The formulas will automatically calculate totals', '', '']
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 10 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Budget');
  return wb;
}

module.exports = {
  generateSheet
};

