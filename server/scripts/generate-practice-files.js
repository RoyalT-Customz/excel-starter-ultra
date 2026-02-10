/**
 * Generate Practice Excel Files
 * Creates practice spreadsheets for each lesson
 */

const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// Create practice files directory
const practiceDir = path.join(__dirname, '..', 'practice-files');
if (!fs.existsSync(practiceDir)) {
  fs.mkdirSync(practiceDir, { recursive: true });
  console.log('✅ Created practice-files directory');
}

/**
 * Generate practice file for each lesson type
 */
function generatePracticeFiles() {
  // Lesson 1: Basic data entry - Simple budget tracker
  const lesson1Data = [
    ['Category', 'Item', 'Amount', 'Date'],
    ['Food', 'Groceries', 150, '2024-01-15'],
    ['Food', 'Restaurant', 45, '2024-01-16'],
    ['Transport', 'Gas', 60, '2024-01-15'],
    ['Transport', 'Bus Pass', 25, '2024-01-17'],
    ['Entertainment', 'Movie', 12, '2024-01-18'],
    ['Bills', 'Electricity', 80, '2024-01-20'],
    ['Bills', 'Internet', 50, '2024-01-20'],
    ['Personal', 'Clothing', 75, '2024-01-22'],
    ['Personal', 'Books', 30, '2024-01-23']
  ];
  createExcelFile(lesson1Data, 'Lesson1_Practice_Budget.xlsx', 'Budget Tracker');

  // Lesson 2: Interface practice - Student grades
  const lesson2Data = [
    ['Student Name', 'Math', 'Science', 'English', 'History', 'Average'],
    ['John Smith', 85, 90, 88, 82, ''],
    ['Emma Johnson', 92, 87, 95, 90, ''],
    ['Michael Brown', 78, 85, 80, 88, ''],
    ['Sarah Davis', 95, 92, 93, 91, ''],
    ['David Wilson', 82, 88, 85, 87, ''],
    ['Lisa Anderson', 90, 91, 89, 93, ''],
    ['Robert Taylor', 88, 85, 87, 85, ''],
    ['Jessica Martinez', 94, 96, 92, 95, ''],
    ['Christopher Lee', 76, 80, 78, 82, ''],
    ['Amanda White', 89, 92, 91, 88, '']
  ];
  createExcelFile(lesson2Data, 'Lesson2_Practice_Grades.xlsx', 'Student Grades');

  // Lesson 3: Data entry - Sales data
  const lesson3Data = [
    ['Date', 'Product', 'Quantity', 'Unit Price', 'Total'],
    ['2024-01-01', 'Widget A', 10, 25, 250],
    ['2024-01-02', 'Widget B', 5, 40, 200],
    ['2024-01-03', 'Widget A', 8, 25, 200],
    ['2024-01-04', 'Widget C', 12, 30, 360],
    ['2024-01-05', 'Widget B', 15, 40, 600],
    ['2024-01-06', 'Widget A', 20, 25, 500],
    ['2024-01-07', 'Widget C', 6, 30, 180],
    ['2024-01-08', 'Widget B', 10, 40, 400],
    ['2024-01-09', 'Widget A', 14, 25, 350],
    ['2024-01-10', 'Widget C', 9, 30, 270]
  ];
  createExcelFile(lesson3Data, 'Lesson3_Practice_Sales.xlsx', 'Sales Data');

  // Lesson 4: Formatting - Product catalog
  const lesson4Data = [
    ['Product ID', 'Product Name', 'Category', 'Price', 'Stock', 'Status'],
    ['P001', 'Wireless Mouse', 'Electronics', 29.99, 45, 'In Stock'],
    ['P002', 'USB Keyboard', 'Electronics', 49.99, 32, 'In Stock'],
    ['P003', 'Monitor 24"', 'Electronics', 179.99, 12, 'Low Stock'],
    ['P004', 'Laptop Stand', 'Accessories', 39.99, 58, 'In Stock'],
    ['P005', 'Mouse Pad', 'Accessories', 9.99, 120, 'In Stock'],
    ['P006', 'HDMI Cable', 'Cables', 14.99, 67, 'In Stock'],
    ['P007', 'USB-C Hub', 'Accessories', 59.99, 23, 'In Stock'],
    ['P008', 'Webcam HD', 'Electronics', 89.99, 8, 'Low Stock'],
    ['P009', 'Desk Lamp', 'Accessories', 34.99, 41, 'In Stock'],
    ['P010', 'Ethernet Cable', 'Cables', 12.99, 89, 'In Stock']
  ];
  createExcelFile(lesson4Data, 'Lesson4_Practice_Products.xlsx', 'Product Catalog');

  // Lesson 5: Formulas - Employee payroll
  const lesson5Data = [
    ['Employee', 'Hours Worked', 'Hourly Rate', 'Gross Pay', 'Tax (20%)', 'Net Pay'],
    ['Alice Cooper', 40, 25, '', '', ''],
    ['Bob Smith', 35, 30, '', '', ''],
    ['Carol White', 40, 28, '', '', ''],
    ['David Brown', 32, 35, '', '', ''],
    ['Eve Johnson', 40, 27, '', '', ''],
    ['Frank Davis', 38, 29, '', '', ''],
    ['Grace Wilson', 40, 26, '', '', ''],
    ['Henry Taylor', 36, 31, '', '', '']
  ];
  createExcelFile(lesson5Data, 'Lesson5_Practice_Payroll.xlsx', 'Employee Payroll');

  // Lesson 6: Sorting & Filtering - Customer orders
  const lesson6Data = [
    ['Order ID', 'Customer Name', 'Product', 'Quantity', 'Order Date', 'Status', 'Total'],
    ['ORD001', 'ABC Company', 'Product A', 50, '2024-01-15', 'Completed', 1250],
    ['ORD002', 'XYZ Corp', 'Product B', 25, '2024-01-16', 'Pending', 750],
    ['ORD003', 'Tech Solutions', 'Product A', 30, '2024-01-17', 'Completed', 900],
    ['ORD004', 'Global Inc', 'Product C', 40, '2024-01-18', 'Processing', 1600],
    ['ORD005', 'ABC Company', 'Product B', 20, '2024-01-19', 'Completed', 600],
    ['ORD006', 'Local Business', 'Product A', 15, '2024-01-20', 'Pending', 450],
    ['ORD007', 'XYZ Corp', 'Product C', 35, '2024-01-21', 'Processing', 1400],
    ['ORD008', 'Tech Solutions', 'Product B', 28, '2024-01-22', 'Completed', 840],
    ['ORD009', 'ABC Company', 'Product C', 22, '2024-01-23', 'Pending', 880],
    ['ORD010', 'Global Inc', 'Product A', 45, '2024-01-24', 'Processing', 1350]
  ];
  createExcelFile(lesson6Data, 'Lesson6_Practice_Orders.xlsx', 'Customer Orders');

  // Lesson 7: Charts - Monthly expenses
  const lesson7Data = [
    ['Month', 'Rent', 'Food', 'Transport', 'Entertainment', 'Bills', 'Total'],
    ['January', 1200, 350, 200, 150, 200, ''],
    ['February', 1200, 380, 220, 120, 200, ''],
    ['March', 1200, 320, 180, 200, 220, ''],
    ['April', 1200, 400, 250, 180, 200, ''],
    ['May', 1200, 370, 230, 160, 200, ''],
    ['June', 1200, 390, 210, 190, 200, ''],
    ['July', 1200, 410, 240, 170, 220, ''],
    ['August', 1200, 360, 200, 210, 200, ''],
    ['September', 1200, 380, 220, 150, 200, ''],
    ['October', 1200, 400, 230, 180, 220, ''],
    ['November', 1200, 350, 210, 200, 200, ''],
    ['December', 1200, 450, 250, 250, 250, '']
  ];
  createExcelFile(lesson7Data, 'Lesson7_Practice_Expenses.xlsx', 'Monthly Expenses');

  // Lesson 8: Comprehensive practice - Complete business spreadsheet
  const lesson8Data = [
    ['Month', 'Revenue', 'Cost of Goods', 'Operating Expenses', 'Net Profit'],
    ['January', 50000, 20000, 15000, ''],
    ['February', 52000, 21000, 15200, ''],
    ['March', 48000, 19500, 14800, ''],
    ['April', 55000, 22000, 16000, ''],
    ['May', 53000, 21200, 15500, ''],
    ['June', 57000, 22800, 16200, ''],
    ['Q1 Total', '', '', '', ''],
    ['Q2 Total', '', '', '', ''],
    ['Year Total', '', '', '', '']
  ];
  createExcelFile(lesson8Data, 'Lesson8_Practice_Business.xlsx', 'Business Summary');

  console.log('✅ Practice files generated successfully!');
}

/**
 * Create an Excel file from data
 */
function createExcelFile(data, filename, sheetName = 'Sheet1') {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  
  // Set column widths for better readability
  const colWidths = data[0].map((_, colIndex) => {
    const maxLength = Math.max(...data.map(row => String(row[colIndex] || '').length));
    return { wch: Math.max(maxLength + 2, 10) };
  });
  worksheet['!cols'] = colWidths;
  
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  const filepath = path.join(practiceDir, filename);
  XLSX.writeFile(workbook, filepath);
  console.log(`✅ Created: ${filename}`);
}

// Run if called directly
if (require.main === module) {
  generatePracticeFiles();
}

module.exports = { generatePracticeFiles };

