/**
 * File Analyzer Controller
 * Analyzes uploaded Excel files and provides AI-powered explanations
 */

const XLSX = require('xlsx');
const fs = require('fs');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

/**
 * Analyze an Excel file and return AI-powered explanation
 * @param {string} filePath - Path to the uploaded Excel file
 * @returns {Promise<Object>} Analysis results
 */
async function analyzeFile(filePath) {
  try {
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    
    // Extract file structure
    const fileInfo = {
      sheetNames: workbook.SheetNames,
      sheets: []
    };
    
    // Analyze each sheet
    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
      
      // Get sheet dimensions
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      const rowCount = range.e.r + 1;
      const colCount = range.e.c + 1;
      
      // Extract formulas (if any)
      const formulas = [];
      for (const cellAddress in worksheet) {
        if (cellAddress.startsWith('!')) continue;
        const cell = worksheet[cellAddress];
        if (cell.f) {
          formulas.push({
            cell: cellAddress,
            formula: cell.f,
            value: cell.v
          });
        }
      }
      
      // Get sample data (first 10 rows)
      const sampleData = jsonData.slice(0, 10);
      
      // Detect data types
      const dataTypes = {};
      if (jsonData.length > 0) {
        const headers = jsonData[0];
        headers.forEach((header, index) => {
          const columnData = jsonData.slice(1).map(row => row[index]).filter(val => val !== '');
          if (columnData.length > 0) {
            const firstValue = columnData[0];
            if (typeof firstValue === 'number') {
              dataTypes[header] = 'Number';
            } else if (firstValue instanceof Date || (typeof firstValue === 'string' && /^\d{4}-\d{2}-\d{2}/.test(firstValue))) {
              dataTypes[header] = 'Date';
            } else {
              dataTypes[header] = 'Text';
            }
          }
        });
      }
      
      fileInfo.sheets.push({
        name: sheetName,
        rowCount,
        colCount,
        headers: jsonData[0] || [],
        sampleData,
        formulas,
        dataTypes
      });
    }
    
    // Generate AI explanation
    const aiExplanation = await generateAIExplanation(fileInfo);
    
    return {
      fileInfo,
      explanation: aiExplanation,
      summary: {
        totalSheets: fileInfo.sheetNames.length,
        totalFormulas: fileInfo.sheets.reduce((sum, sheet) => sum + sheet.formulas.length, 0),
        totalRows: fileInfo.sheets.reduce((sum, sheet) => sum + sheet.rowCount, 0)
      }
    };
  } catch (error) {
    console.error('File analysis error:', error);
    throw new Error(`Failed to analyze file: ${error.message}`);
  }
}

/**
 * Generate AI-powered explanation of the Excel file
 * @param {Object} fileInfo - File structure information
 * @returns {Promise<string>} AI explanation
 */
async function generateAIExplanation(fileInfo) {
  try {
    const fileSummary = JSON.stringify(fileInfo, null, 2);
    
    const prompt = `You are a friendly Excel tutor explaining an Excel file to a complete beginner. 

Here's the file structure:
${fileSummary}

Please provide:
1. A simple overview of what this Excel file contains
2. What each sheet does (in beginner-friendly language)
3. What formulas are used (if any) and what they do
4. Any potential issues or errors you notice
5. Suggestions for improvement

Use very simple language, avoid technical jargon, and be encouraging.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are a patient, friendly Excel tutor for beginners. Explain things simply and clearly.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });
    
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('AI explanation error:', error);
    // Return a basic explanation if AI fails
    return `This Excel file contains ${fileInfo.sheetNames.length} sheet(s): ${fileInfo.sheetNames.join(', ')}. 
    Each sheet has data organized in rows and columns. Review the file structure above for more details.`;
  }
}

module.exports = {
  analyzeFile
};

