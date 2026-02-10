/**
 * Script to generate placeholder Excel tutorial images
 * Uses canvas library to create simple PNG images
 */

const fs = require('fs');
const path = require('path');

// Check if we can use canvas library
let canvas;
let createCanvas;
try {
  const canvasModule = require('canvas');
  createCanvas = canvasModule.createCanvas;
} catch (e) {
  console.log('⚠️  Canvas library not found. Installing...');
  console.log('📦 Please run: npm install canvas --save');
  console.log('   Then run this script again.');
  process.exit(1);
}

const imagesDir = path.join(__dirname, '../../client/public/images');

// Ensure images directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

function createExcelInterfaceImage() {
  const width = 800;
  const height = 500;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#f3f3f3';
  ctx.fillRect(0, 0, width, height);
  
  // Border
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  // Title
  ctx.fillStyle = '#333';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Excel Interface Overview', width / 2, 40);

  // Ribbon
  ctx.fillStyle = '#2e75b6';
  ctx.fillRect(50, 70, 700, 80);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 18px Arial';
  ctx.fillText('Ribbon (Home, Insert, Page Layout, etc.)', width / 2, 120);

  // Formula Bar
  ctx.fillStyle = '#e7e7e7';
  ctx.fillRect(50, 170, 700, 35);
  ctx.strokeStyle = '#999';
  ctx.strokeRect(50, 170, 700, 35);
  ctx.fillStyle = '#666';
  ctx.font = '14px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Name Box: A1  |  Formula Bar: Selected cell content appears here', 60, 193);

  // Column Headers (A, B, C)
  const colWidth = 70;
  const startX = 50;
  const headerY = 220;
  
  for (let i = 0; i < 3; i++) {
    const x = startX + (i * colWidth);
    ctx.fillStyle = '#e7e7e7';
    ctx.fillRect(x, headerY, colWidth - 2, 28);
    ctx.strokeStyle = '#999';
    ctx.strokeRect(x, headerY, colWidth - 2, 28);
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(String.fromCharCode(65 + i), x + colWidth / 2 - 1, headerY + 20);
  }

  // Row Numbers (1, 2, 3)
  const rowHeight = 35;
  const rowStartY = 248;
  const numWidth = 35;
  
  for (let i = 0; i < 3; i++) {
    const y = rowStartY + (i * rowHeight);
    ctx.fillStyle = '#e7e7e7';
    ctx.fillRect(50, y, numWidth - 2, rowHeight - 2);
    ctx.strokeStyle = '#999';
    ctx.strokeRect(50, y, numWidth - 2, rowHeight - 2);
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText((i + 1).toString(), 50 + numWidth / 2 - 1, y + 23);
  }

  // Cells
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const x = 50 + numWidth + (col * colWidth);
      const y = rowStartY + (row * rowHeight);
      const cellWidth = colWidth - 2;
      const cellHeight = rowHeight - 2;
      
      if (row === 0 && col === 1) {
        // Selected cell (highlighted)
        ctx.fillStyle = '#fffacd';
        ctx.fillRect(x, y, cellWidth, cellHeight);
        ctx.strokeStyle = '#ffa500';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, cellWidth, cellHeight);
      } else {
        ctx.fillStyle = '#fff';
        ctx.fillRect(x, y, cellWidth, cellHeight);
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellWidth, cellHeight);
      }
      
      // Cell label
      ctx.fillStyle = '#333';
      ctx.font = '11px Arial';
      ctx.textAlign = 'center';
      const cellName = String.fromCharCode(65 + col) + (row + 1);
      ctx.fillText(`Cell ${cellName}`, x + cellWidth / 2, y + cellHeight / 2 + 4);
    }
  }

  // Labels
  ctx.fillStyle = '#333';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Key Elements:', width / 2, 370);

  ctx.font = '14px Arial';
  ctx.textAlign = 'left';
  const labels = [
    '• Cells: Small boxes where you type data',
    '• Rows: Horizontal lines (numbered 1, 2, 3...)',
    '• Columns: Vertical lines (labeled A, B, C...)',
    '• Ribbon: Toolbar at top with all commands',
    '• Formula Bar: Shows cell contents'
  ];
  
  labels.forEach((label, i) => {
    ctx.fillText(label, 150, 400 + (i * 25));
  });

  return canvas.toBuffer('image/png');
}

function createRibbonImage() {
  const width = 800;
  const height = 150;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#f3f3f3';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  // Title
  ctx.fillStyle = '#333';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Excel Ribbon - Toolbar Overview', width / 2, 40);

  // Ribbon background
  ctx.fillStyle = '#2e75b6';
  ctx.fillRect(50, 60, width - 100, 70);

  // Tabs
  const tabs = ['Home', 'Insert', 'Page Layout', 'Formulas', 'Data', 'Review', 'View'];
  const tabWidth = 90;
  const tabStartX = 60;
  const tabY = 70;
  
  tabs.forEach((tab, i) => {
    const x = tabStartX + (i * tabWidth);
    if (i === 0) {
      // Active tab
      ctx.fillStyle = '#fff';
      ctx.fillRect(x, tabY, tabWidth - 5, 50);
      ctx.fillStyle = '#2e75b6';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(tab, x + tabWidth / 2 - 2.5, tabY + 30);
    } else {
      // Inactive tabs
      ctx.fillStyle = '#1f4e79';
      ctx.fillRect(x, tabY, tabWidth - 5, 50);
      ctx.fillStyle = '#fff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(tab, x + tabWidth / 2 - 2.5, tabY + 30);
    }
  });

  // Tool groups in Home tab (example)
  ctx.fillStyle = '#fff';
  ctx.font = '12px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Clipboard | Font | Alignment | Number | Styles | Cells | Editing', 70, 135);

  return canvas.toBuffer('image/png');
}

function createEnteringDataImage() {
  const width = 700;
  const height = 400;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#f3f3f3';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  // Title
  ctx.fillStyle = '#333';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Entering Data in Excel', width / 2, 40);

  // Grid
  const cellSize = 60;
  const startX = 100;
  const startY = 80;

  // Column headers
  const cols = ['A', 'B', 'C', 'D'];
  cols.forEach((col, i) => {
    const x = startX + (i * cellSize);
    ctx.fillStyle = '#e7e7e7';
    ctx.fillRect(x, startY, cellSize - 2, 25);
    ctx.strokeStyle = '#999';
    ctx.strokeRect(x, startY, cellSize - 2, 25);
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(col, x + cellSize / 2 - 1, startY + 18);
  });

  // Example data
  const data = [
    { row: 1, values: ['Name', 'Age', 'City', 'Salary'] },
    { row: 2, values: ['John', '25', 'NYC', '$50k'] },
    { row: 3, values: ['Jane', '30', 'LA', '$60k'] },
    { row: 4, values: ['Bob', '28', 'Chicago', '$55k'] }
  ];

  data.forEach((row, rowIdx) => {
    const y = startY + 27 + (rowIdx * cellSize);
    
    // Row number
    ctx.fillStyle = '#e7e7e7';
    ctx.fillRect(startX - 30, y, 28, cellSize - 2);
    ctx.strokeStyle = '#999';
    ctx.strokeRect(startX - 30, y, 28, cellSize - 2);
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(row.row.toString(), startX - 16, y + cellSize / 2 + 5);

    // Cells
    row.values.forEach((value, colIdx) => {
      const x = startX + (colIdx * cellSize);
      ctx.fillStyle = '#fff';
      ctx.fillRect(x, y, cellSize - 2, cellSize - 2);
      ctx.strokeStyle = '#ccc';
      ctx.strokeRect(x, y, cellSize - 2, cellSize - 2);
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(value, x + cellSize / 2 - 1, y + cellSize / 2 + 4);
    });
  });

  // Instructions
  ctx.fillStyle = '#0066cc';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Steps:', 100, 340);
  ctx.fillStyle = '#333';
  ctx.font = '14px Arial';
  ctx.fillText('1. Click a cell to select it', 100, 365);
  ctx.fillText('2. Type your data', 100, 385);

  return canvas.toBuffer('image/png');
}

function createFormattingToolsImage() {
  const width = 700;
  const height = 300;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#f3f3f3';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  // Title
  ctx.fillStyle = '#333';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Formatting Tools - Home Tab', width / 2, 40);

  // Ribbon section
  ctx.fillStyle = '#2e75b6';
  ctx.fillRect(50, 70, width - 100, 100);

  // Font group
  ctx.fillStyle = '#fff';
  ctx.fillRect(70, 90, 250, 70);
  ctx.strokeStyle = '#ccc';
  ctx.strokeRect(70, 90, 250, 70);
  ctx.fillStyle = '#333';
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Font', 80, 105);
  ctx.font = '14px Arial';
  ctx.fillText('B I U', 80, 130);
  ctx.fillText('A A (font size)', 150, 130);

  // Alignment group
  ctx.fillStyle = '#fff';
  ctx.fillRect(340, 90, 200, 70);
  ctx.strokeStyle = '#ccc';
  ctx.strokeRect(340, 90, 200, 70);
  ctx.fillStyle = '#333';
  ctx.font = 'bold 12px Arial';
  ctx.fillText('Alignment', 350, 105);
  ctx.font = '14px Arial';
  ctx.fillText('Left | Center | Right', 350, 130);

  // Number group
  ctx.fillStyle = '#fff';
  ctx.fillRect(560, 90, 150, 70);
  ctx.strokeStyle = '#ccc';
  ctx.strokeRect(560, 90, 150, 70);
  ctx.fillStyle = '#333';
  ctx.font = 'bold 12px Arial';
  ctx.fillText('Number', 570, 105);
  ctx.font = '14px Arial';
  ctx.fillText('$ % , (format)', 570, 130);

  // Labels
  ctx.fillStyle = '#333';
  ctx.font = '14px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('• Bold (B) - Makes text bold', 100, 210);
  ctx.fillText('• Italic (I) - Makes text italic', 100, 235);
  ctx.fillText('• Underline (U) - Underlines text', 100, 260);
  ctx.fillText('• Colors - Change text and background colors', 100, 285);

  return canvas.toBuffer('image/png');
}

function createChartsImage() {
  const width = 700;
  const height = 450;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#f3f3f3';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  // Title
  ctx.fillStyle = '#333';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Creating Charts in Excel', width / 2, 40);

  // Simple bar chart example
  const chartStartX = 100;
  const chartStartY = 100;
  const chartWidth = 400;
  const chartHeight = 250;
  const maxValue = 100;

  // Chart background
  ctx.fillStyle = '#fff';
  ctx.fillRect(chartStartX, chartStartY, chartWidth, chartHeight);
  ctx.strokeStyle = '#999';
  ctx.strokeRect(chartStartX, chartStartY, chartWidth, chartHeight);

  // Bars
  const bars = [
    { label: 'Q1', value: 80, color: '#2e75b6' },
    { label: 'Q2', value: 90, color: '#5b9bd5' },
    { label: 'Q3', value: 70, color: '#2e75b6' },
    { label: 'Q4', value: 95, color: '#5b9bd5' }
  ];

  const barWidth = 60;
  const barSpacing = 40;

  bars.forEach((bar, i) => {
    const x = chartStartX + 50 + (i * (barWidth + barSpacing));
    const barHeight = (bar.value / maxValue) * chartHeight * 0.8;
    const y = chartStartY + chartHeight - barHeight - 30;

    ctx.fillStyle = bar.color;
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.strokeStyle = '#1f4e79';
    ctx.strokeRect(x, y, barWidth, barHeight);

    // Value label
    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(bar.value.toString(), x + barWidth / 2, y - 5);

    // X-axis label
    ctx.fillText(bar.label, x + barWidth / 2, chartStartY + chartHeight - 10);
  });

  // Instructions
  ctx.fillStyle = '#0066cc';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Steps to create a chart:', 100, 390);
  ctx.fillStyle = '#333';
  ctx.font = '12px Arial';
  ctx.fillText('1. Select your data  2. Click Insert tab  3. Choose chart type', 100, 410);

  return canvas.toBuffer('image/png');
}

function createSaveButtonImage() {
  const width = 600;
  const height = 250;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#f3f3f3';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  // Title
  ctx.fillStyle = '#333';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Save Your Work', width / 2, 40);

  // Quick Access Toolbar area
  ctx.fillStyle = '#e7e7e7';
  ctx.fillRect(50, 70, 500, 40);
  ctx.strokeStyle = '#999';
  ctx.strokeRect(50, 70, 500, 40);

  // Save button (floppy disk icon)
  ctx.fillStyle = '#2e75b6';
  ctx.fillRect(60, 75, 50, 30);
  ctx.strokeStyle = '#1f4e79';
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 75, 50, 30);
  
  // Floppy disk shape
  ctx.fillStyle = '#1f4e79';
  ctx.fillRect(62, 77, 46, 26);
  ctx.fillStyle = '#5b9bd5';
  ctx.fillRect(70, 79, 30, 18);
  ctx.fillStyle = '#fff';
  ctx.fillRect(85, 82, 4, 12);

  // Label
  ctx.fillStyle = '#333';
  ctx.font = '14px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Save Button (Ctrl+S)', 120, 95);

  // File menu option
  ctx.fillStyle = '#2e75b6';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('File →', 250, 95);
  ctx.fillStyle = '#333';
  ctx.font = '14px Arial';
  ctx.fillText('Save / Save As', 300, 95);

  // Instructions
  ctx.fillStyle = '#0066cc';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Keyboard Shortcut:', 100, 150);
  ctx.fillStyle = '#333';
  ctx.font = '18px Arial';
  ctx.fillText('Ctrl + S', 100, 175);

  ctx.fillStyle = '#666';
  ctx.font = '12px Arial';
  ctx.fillText('(Press Ctrl and S together to save quickly!)', 100, 200);

  return canvas.toBuffer('image/png');
}

// Generate all images
console.log('🎨 Generating Excel tutorial images...\n');

const images = [
  { name: 'excel-interface.png', generator: createExcelInterfaceImage },
  { name: 'excel-ribbon.png', generator: createRibbonImage },
  { name: 'entering-data.png', generator: createEnteringDataImage },
  { name: 'formatting-tools.png', generator: createFormattingToolsImage },
  { name: 'creating-charts.png', generator: createChartsImage },
  { name: 'save-button.png', generator: createSaveButtonImage }
];

images.forEach(({ name, generator }) => {
  try {
    const buffer = generator();
    const filePath = path.join(imagesDir, name);
    fs.writeFileSync(filePath, buffer);
    console.log(`✅ Created ${name}`);
  } catch (error) {
    console.error(`❌ Error creating ${name}:`, error.message);
  }
});

console.log('\n✨ Image generation complete!');
console.log(`📁 Images saved to: ${imagesDir}`);

