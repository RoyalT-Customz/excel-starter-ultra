/**
 * Interactive Challenge Component
 * Renders the appropriate interactive mini-game based on lesson ID
 * Each lesson has tailored challenges for hands-on learning
 */

import React, { useState } from 'react';
import MiniSpreadsheet from './MiniSpreadsheet';
import MatchingGame from './MatchingGame';
import FormulaChallenge from './FormulaChallenge';

const InteractiveChallenge = ({ lessonOrderIndex, onXpEarned = () => {} }) => {
  const [completedChallenges, setCompletedChallenges] = useState(0);
  const [totalXpEarned, setTotalXpEarned] = useState(0);

  const handleChallengeComplete = (xp = 10) => {
    setCompletedChallenges(prev => prev + 1);
    setTotalXpEarned(prev => prev + xp);
    const currentXp = parseInt(localStorage.getItem('excel-xp') || '0');
    localStorage.setItem('excel-xp', (currentXp + xp).toString());
    onXpEarned(xp);
  };

  const getChallengesForLesson = () => {
    switch (lessonOrderIndex) {
      case 1: // What is Excel?
        return (
          <div className="space-y-6">
            <ChallengeHeader 
              title="Mini-Game: Learn by Doing!" 
              subtitle="Complete these interactive challenges to reinforce what you learned"
            />
            <MatchingGame
              title="🧩 Match Excel Terms"
              pairs={[
                { term: "Spreadsheet", definition: "A digital table with rows and columns" },
                { term: "Cell", definition: "A box where rows and columns meet" },
                { term: "Formula", definition: "An instruction that calculates values automatically" },
                { term: "Chart", definition: "A visual representation of data" },
                { term: "Workbook", definition: "An Excel file that can contain multiple sheets" },
                { term: "Filter", definition: "A tool to show only specific data" }
              ]}
              onComplete={() => handleChallengeComplete(15)}
            />
            <MiniSpreadsheet
              rows={4}
              cols={3}
              instructions="Welcome to your first spreadsheet! Try clicking cells and typing data. Enter your name in A1, your age in B1, and your city in C1."
              editableCells={null}
              targetValues={{ "A1": null }}
              onComplete={() => handleChallengeComplete(10)}
            />
          </div>
        );

      case 2: // How To Navigate in Excel
        return (
          <div className="space-y-6">
            <ChallengeHeader 
              title="Navigation Challenge!" 
              subtitle="Test your knowledge of Excel navigation"
            />
            <MatchingGame
              title="🧩 Match Keyboard Shortcuts"
              pairs={[
                { term: "Ctrl + Home", definition: "Jump to cell A1" },
                { term: "Ctrl + End", definition: "Jump to last cell with data" },
                { term: "Tab", definition: "Move one cell to the right" },
                { term: "Ctrl + Arrow", definition: "Jump to edge of data region" },
                { term: "Ctrl + F", definition: "Open Find dialog" },
                { term: "Page Down", definition: "Scroll down one screen" },
                { term: "Ctrl + G", definition: "Go To a specific cell" }
              ]}
              onComplete={() => handleChallengeComplete(15)}
            />
            <CellReferenceQuiz onComplete={() => handleChallengeComplete(10)} />
          </div>
        );

      case 3: // Excel Interface
        return (
          <div className="space-y-6">
            <ChallengeHeader 
              title="Interface Explorer!" 
              subtitle="See if you can identify all parts of the Excel interface"
            />
            <MatchingGame
              title="🧩 Match Interface Parts"
              pairs={[
                { term: "Ribbon", definition: "Toolbar at the top with tabs and buttons" },
                { term: "Formula Bar", definition: "Shows contents of the selected cell" },
                { term: "Name Box", definition: "Displays the address of the current cell" },
                { term: "Sheet Tabs", definition: "Tabs at the bottom to switch between sheets" },
                { term: "Status Bar", definition: "Shows info like average and sum at the bottom" },
                { term: "Quick Access Toolbar", definition: "Customizable toolbar above the Ribbon" }
              ]}
              onComplete={() => handleChallengeComplete(15)}
            />
            <MiniSpreadsheet
              rows={5}
              cols={4}
              instructions="Practice identifying cell addresses! Type the cell address that is at Row 3, Column B (type 'B3' in cell A1)."
              initialData={{ "B3": "⭐" }}
              editableCells={["A1"]}
              targetValues={{ "A1": "B3" }}
              onComplete={() => handleChallengeComplete(10)}
            />
          </div>
        );

      case 4: // Entering Data
        return (
          <div className="space-y-6">
            <ChallengeHeader 
              title="Data Entry Challenge!" 
              subtitle="Practice entering different types of data"
            />
            <MiniSpreadsheet
              rows={6}
              cols={4}
              instructions="Create a contact list! Enter headers in Row 1: Name (A1), Age (B1), City (C1), Phone (D1). Then fill in at least 2 contacts."
              initialData={{}}
              editableCells={null}
              targetValues={{ "A1": "Name", "B1": "Age", "C1": "City", "D1": "Phone" }}
              onComplete={() => handleChallengeComplete(15)}
            />
            <MatchingGame
              title="🧩 Data Types in Excel"
              pairs={[
                { term: "Text", definition: "Aligns to the left side of the cell" },
                { term: "Numbers", definition: "Aligns to the right side of the cell" },
                { term: "Dates", definition: "Excel recognizes formats like 1/15/2024" },
                { term: "AutoFill", definition: "Drag the fill handle to continue a pattern" },
                { term: "Ctrl+Z", definition: "Undo the last action" }
              ]}
              onComplete={() => handleChallengeComplete(10)}
            />
          </div>
        );

      case 5: // Formatting
        return (
          <div className="space-y-6">
            <ChallengeHeader 
              title="Formatting Master!" 
              subtitle="Learn formatting shortcuts and concepts"
            />
            <MatchingGame
              title="🧩 Formatting Shortcuts"
              pairs={[
                { term: "Ctrl + B", definition: "Make text Bold" },
                { term: "Ctrl + I", definition: "Make text Italic" },
                { term: "Ctrl + U", definition: "Underline text" },
                { term: "Ctrl + 1", definition: "Open Format Cells dialog" },
                { term: "Fill Color", definition: "Changes background color of a cell" },
                { term: "Format Painter", definition: "Copies formatting from one cell to another" }
              ]}
              onComplete={() => handleChallengeComplete(15)}
            />
            <FormatQuiz onComplete={() => handleChallengeComplete(10)} />
          </div>
        );

      case 6: // Simple Formulas
        return (
          <div className="space-y-6">
            <ChallengeHeader 
              title="Formula Academy!" 
              subtitle="Build your first formulas"
            />
            <FormulaChallenge
              title="🧮 Write the Formula"
              challenges={[
                {
                  prompt: "Write a formula to find the SMALLEST number in cells A1 through A5.",
                  data: { "A1": 10, "A2": 5, "A3": 25, "A4": 3, "A5": 15 },
                  answer: "=MIN(A1:A5)",
                  altAnswers: ["MIN(A1:A5)"],
                  hint: "The function to find the minimum is MIN(range)",
                  explanation: "=MIN(A1:A5) returns 3, the smallest number in the range."
                },
                {
                  prompt: "Write a formula to find the LARGEST number in cells B1 through B4.",
                  data: { "B1": 45, "B2": 80, "B3": 12, "B4": 67 },
                  answer: "=MAX(B1:B4)",
                  altAnswers: ["MAX(B1:B4)"],
                  hint: "The function to find the maximum is MAX(range)",
                  explanation: "=MAX(B1:B4) returns 80, the largest number."
                },
                {
                  prompt: "Write a formula to COUNT how many cells contain numbers from A1 to A6.",
                  data: { "A1": 10, "A2": "Text", "A3": 25, "A4": 3, "A5": "", "A6": 15 },
                  answer: "=COUNT(A1:A6)",
                  altAnswers: ["COUNT(A1:A6)"],
                  hint: "COUNT counts cells that contain numbers",
                  explanation: "=COUNT(A1:A6) returns 4 (skips text and empty cells)."
                },
                {
                  prompt: "Add cells A1 and B1 together.",
                  data: { "A1": 15, "B1": 25 },
                  answer: "=A1+B1",
                  altAnswers: ["A1+B1", "=B1+A1", "B1+A1"],
                  hint: "Use the + operator between cell references",
                  explanation: "=A1+B1 returns 40."
                }
              ]}
              onComplete={() => handleChallengeComplete(20)}
            />
            <MatchingGame
              title="🧩 Formula Error Codes"
              pairs={[
                { term: "#VALUE!", definition: "Trying to do math with text" },
                { term: "#DIV/0!", definition: "Dividing by zero" },
                { term: "#REF!", definition: "Referencing a cell that doesn't exist" },
                { term: "#NAME?", definition: "Typo in a function name" }
              ]}
              onComplete={() => handleChallengeComplete(10)}
            />
          </div>
        );

      case 7: // SUM
        return (
          <div className="space-y-6">
            <ChallengeHeader 
              title="SUM Mastery!" 
              subtitle="Master the most important Excel function"
            />
            <FormulaChallenge
              title="🧮 SUM Formula Challenges"
              challenges={[
                {
                  prompt: "Add up all expenses in cells B2 through B6.",
                  data: { "A1": "Item", "B1": "Cost", "A2": "Rent", "B2": 800, "A3": "Food", "B3": 300, "A4": "Gas", "B4": 150, "A5": "Phone", "B5": 50, "A6": "Internet", "B6": 70 },
                  answer: "=SUM(B2:B6)",
                  altAnswers: ["SUM(B2:B6)"],
                  hint: "Use SUM with the range B2:B6",
                  explanation: "=SUM(B2:B6) adds 800+300+150+50+70 = 1370"
                },
                {
                  prompt: "Calculate the total of cells A1, C1, and E1 (they are NOT in a continuous range).",
                  data: { "A1": 100, "B1": "skip", "C1": 200, "D1": "skip", "E1": 300 },
                  answer: "=SUM(A1,C1,E1)",
                  altAnswers: ["SUM(A1,C1,E1)", "=A1+C1+E1", "A1+C1+E1"],
                  hint: "You can list individual cells in SUM separated by commas",
                  explanation: "=SUM(A1,C1,E1) adds 100+200+300 = 600"
                },
                {
                  prompt: "Add up TWO ranges: B1:B3 and D1:D3.",
                  data: { "B1": 10, "B2": 20, "B3": 30, "D1": 40, "D2": 50, "D3": 60 },
                  answer: "=SUM(B1:B3,D1:D3)",
                  altAnswers: ["SUM(B1:B3,D1:D3)"],
                  hint: "Separate the two ranges with a comma inside SUM()",
                  explanation: "=SUM(B1:B3,D1:D3) adds 10+20+30+40+50+60 = 210"
                }
              ]}
              onComplete={() => handleChallengeComplete(20)}
            />
            <MiniSpreadsheet
              rows={7}
              cols={2}
              instructions="Build a shopping list budget! Enter items in column A and prices in column B (rows 1-5). Then write a SUM formula in B6 to total them up."
              initialData={{ "A1": "Milk", "B1": "3.50", "A2": "Bread", "B2": "2.00", "A3": "Eggs", "B3": "4.50", "A4": "Butter", "B4": "3.00", "A5": "Juice", "B5": "5.00" }}
              editableCells={["B6", "A6"]}
              targetValues={{}}
              highlightCells={["B6"]}
              onComplete={() => handleChallengeComplete(10)}
            />
          </div>
        );

      case 8: // How to Write Formulas
        return (
          <div className="space-y-6">
            <ChallengeHeader 
              title="Formula Writing Workshop!" 
              subtitle="Learn to write formulas like a pro"
            />
            <FormulaChallenge
              title="🧮 Order of Operations"
              challenges={[
                {
                  prompt: "What does this formula equal? =2+3*4 (type just the number)",
                  data: {},
                  answer: "14",
                  altAnswers: ["=14"],
                  hint: "Remember PEMDAS: multiplication happens before addition",
                  explanation: "3*4=12, then 2+12=14. Multiplication first!"
                },
                {
                  prompt: "What does this formula equal? =(2+3)*4 (type just the number)",
                  data: {},
                  answer: "20",
                  altAnswers: ["=20"],
                  hint: "Parentheses are calculated first",
                  explanation: "(2+3)=5, then 5*4=20. Parentheses change the order!"
                },
                {
                  prompt: "Write a formula to calculate B2 with 8% tax. B2 has a subtotal.",
                  data: { "B2": 100 },
                  answer: "=B2*1.08",
                  altAnswers: ["B2*1.08", "=B2*(1+0.08)", "B2*(1+0.08)"],
                  hint: "Multiply by 1.08 to add 8% tax",
                  explanation: "=B2*1.08 gives 100*1.08 = 108"
                },
                {
                  prompt: "Write a formula for percentage change: old value in A1, new value in B1.",
                  data: { "A1": 50, "B1": 75 },
                  answer: "=(B1-A1)/A1",
                  altAnswers: ["(B1-A1)/A1"],
                  hint: "Percentage change = (new - old) / old",
                  explanation: "=(B1-A1)/A1 = (75-50)/50 = 0.5 or 50%"
                }
              ]}
              onComplete={() => handleChallengeComplete(20)}
            />
            <MatchingGame
              title="🧩 Cell Reference Types"
              pairs={[
                { term: "=A1", definition: "Relative reference - changes when copied" },
                { term: "=$A$1", definition: "Absolute reference - never changes when copied" },
                { term: "=$A1", definition: "Mixed - column locked, row changes" },
                { term: "=A$1", definition: "Mixed - row locked, column changes" }
              ]}
              onComplete={() => handleChallengeComplete(10)}
            />
          </div>
        );

      case 9: // Pivot Tables
        return (
          <div className="space-y-6">
            <ChallengeHeader 
              title="Pivot Table Challenge!" 
              subtitle="Test your understanding of pivot table concepts"
            />
            <MatchingGame
              title="🧩 Pivot Table Areas"
              pairs={[
                { term: "Rows", definition: "Categories you want to group data by" },
                { term: "Columns", definition: "Categories shown across the top" },
                { term: "Values", definition: "Numbers you want to calculate (sum, count, etc.)" },
                { term: "Filters", definition: "Optional area to filter the entire table" },
                { term: "Slicer", definition: "Visual filter with clickable buttons" },
                { term: "Refresh", definition: "Updates the pivot table when source data changes" }
              ]}
              onComplete={() => handleChallengeComplete(15)}
            />
            <PivotTableQuiz onComplete={() => handleChallengeComplete(15)} />
          </div>
        );

      case 10: // Sorting & Filtering
        return (
          <div className="space-y-6">
            <ChallengeHeader 
              title="Sort & Filter Challenge!" 
              subtitle="Master data organization"
            />
            <MatchingGame
              title="🧩 Sort & Filter Concepts"
              pairs={[
                { term: "Sort A to Z", definition: "Ascending order (smallest to largest)" },
                { term: "Sort Z to A", definition: "Descending order (largest to smallest)" },
                { term: "Filter", definition: "Temporarily hides rows that don't match criteria" },
                { term: "Wildcards (*)", definition: "Matches any number of characters in text filters" },
                { term: "Multi-level Sort", definition: "Sort by multiple columns in priority order" },
                { term: "Clear Filter", definition: "Shows all hidden rows again" }
              ]}
              onComplete={() => handleChallengeComplete(15)}
            />
            <SortingQuiz onComplete={() => handleChallengeComplete(15)} />
          </div>
        );

      case 11: // Creating Charts
        return (
          <div className="space-y-6">
            <ChallengeHeader 
              title="Chart Champion!" 
              subtitle="Learn when and how to use different chart types"
            />
            <MatchingGame
              title="🧩 Pick the Right Chart"
              pairs={[
                { term: "Column/Bar Chart", definition: "Best for comparing values across categories" },
                { term: "Line Chart", definition: "Best for showing trends over time" },
                { term: "Pie Chart", definition: "Best for showing parts of a whole" },
                { term: "Scatter Plot", definition: "Best for finding relationships between two variables" },
                { term: "Area Chart", definition: "Shows cumulative values over time" }
              ]}
              onComplete={() => handleChallengeComplete(15)}
            />
            <ChartQuiz onComplete={() => handleChallengeComplete(15)} />
          </div>
        );

      case 12: // Saving & Opening Files
        return (
          <div className="space-y-6">
            <ChallengeHeader 
              title="File Management Pro!" 
              subtitle="Master saving and organizing your Excel files"
            />
            <MatchingGame
              title="🧩 File Formats"
              pairs={[
                { term: ".xlsx", definition: "Modern Excel format (2007+)" },
                { term: ".xls", definition: "Older Excel format (97-2003)" },
                { term: ".csv", definition: "Plain text, comma-separated values" },
                { term: ".pdf", definition: "Read-only portable document format" },
                { term: "Ctrl + S", definition: "Quick Save keyboard shortcut" },
                { term: "F12", definition: "Opens Save As dialog" }
              ]}
              onComplete={() => handleChallengeComplete(15)}
            />
            <MatchingGame
              title="🧩 Keyboard Shortcuts for Files"
              pairs={[
                { term: "Ctrl + S", definition: "Save current file" },
                { term: "Ctrl + O", definition: "Open a file" },
                { term: "Ctrl + N", definition: "Create new workbook" },
                { term: "Ctrl + W", definition: "Close current workbook" },
                { term: "Ctrl + Z", definition: "Undo last action" }
              ]}
              onComplete={() => handleChallengeComplete(10)}
            />
          </div>
        );

      default:
        return (
          <div className="bg-dark-surface rounded-xl p-6 border border-baby-pink/20 text-center">
            <p className="text-gray-400">No interactive challenges available for this lesson yet.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {getChallengesForLesson()}
      
      {/* XP Summary */}
      {totalXpEarned > 0 && (
        <div className="bg-dark-card rounded-xl p-4 border border-baby-pink/30 text-center">
          <p className="text-baby-pink font-bold text-lg">
            ⚡ Total XP earned this lesson: +{totalXpEarned}
          </p>
        </div>
      )}
    </div>
  );
};

// Challenge Header
const ChallengeHeader = ({ title, subtitle }) => (
  <div className="text-center py-2">
    <h2 className="text-2xl font-bold text-baby-pink">{title}</h2>
    <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
  </div>
);

// Cell Reference Quiz (for lesson 2)
const CellReferenceQuiz = ({ onComplete }) => {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  
  const questions = [
    { q: "What is the address of the cell at Column C, Row 5?", a: "C5" },
    { q: "Which cell is at Column A, Row 1?", a: "A1" },
    { q: "What shortcut selects ALL cells?", a: "Ctrl+A" },
  ];

  const handleCheck = () => {
    setChecked(true);
    const allCorrect = questions.every((q, i) => 
      (answers[i] || '').trim().toUpperCase() === q.a.toUpperCase()
    );
    if (allCorrect) onComplete();
  };

  return (
    <div className="bg-dark-surface rounded-xl p-4 border border-baby-pink/20">
      <h3 className="text-lg font-bold text-baby-pink mb-3">📝 Quick Quiz</h3>
      <div className="space-y-3">
        {questions.map((q, i) => (
          <div key={i}>
            <p className="text-gray-300 text-sm mb-1">{q.q}</p>
            <input
              type="text"
              value={answers[i] || ''}
              onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
              className={`w-full px-3 py-2 bg-dark-card border rounded-lg text-sm text-white font-mono focus:outline-none ${
                checked 
                  ? (answers[i] || '').trim().toUpperCase() === q.a.toUpperCase()
                    ? 'border-green-500' : 'border-red-500'
                  : 'border-dark-border focus:border-baby-pink'
              }`}
              placeholder="Type your answer..."
            />
            {checked && (answers[i] || '').trim().toUpperCase() !== q.a.toUpperCase() && (
              <p className="text-xs text-red-400 mt-1">Answer: {q.a}</p>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={handleCheck}
        className="mt-3 px-4 py-2 bg-baby-pink text-black rounded-lg font-bold text-sm hover:bg-baby-pink-light transition-colors"
      >
        Check Answers
      </button>
    </div>
  );
};

// Format Quiz (for lesson 5)
const FormatQuiz = ({ onComplete }) => {
  const [selected, setSelected] = useState({});
  const [checked, setChecked] = useState(false);

  const questions = [
    { q: "What shortcut makes text Bold?", options: ["Ctrl+B", "Ctrl+I", "Ctrl+F", "Ctrl+U"], a: 0 },
    { q: "What's the best font size for headers?", options: ["6pt", "12-16pt", "50pt", "8pt"], a: 1 },
    { q: "What tool copies formatting from one cell to another?", options: ["Copy Paste", "Format Painter", "AutoFill", "Filter"], a: 1 }
  ];

  const handleCheck = () => {
    setChecked(true);
    if (questions.every((q, i) => selected[i] === q.a)) onComplete();
  };

  return (
    <div className="bg-dark-surface rounded-xl p-4 border border-baby-pink/20">
      <h3 className="text-lg font-bold text-baby-pink mb-3">📝 Formatting Quiz</h3>
      {questions.map((q, qi) => (
        <div key={qi} className="mb-4">
          <p className="text-gray-300 text-sm mb-2">{q.q}</p>
          <div className="grid grid-cols-2 gap-2">
            {q.options.map((opt, oi) => (
              <button
                key={oi}
                onClick={() => setSelected({ ...selected, [qi]: oi })}
                className={`p-2 rounded-lg text-xs border transition-all ${
                  checked && oi === q.a ? 'border-green-500 bg-green-900/20 text-green-300' :
                  checked && selected[qi] === oi && oi !== q.a ? 'border-red-500 bg-red-900/20 text-red-300' :
                  selected[qi] === oi ? 'border-baby-pink bg-baby-pink/10 text-white' :
                  'border-dark-border text-gray-400 hover:border-baby-pink/50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button onClick={handleCheck} className="px-4 py-2 bg-baby-pink text-black rounded-lg font-bold text-sm hover:bg-baby-pink-light transition-colors">
        Check Answers
      </button>
    </div>
  );
};

// Pivot Table Quiz (for lesson 9)
const PivotTableQuiz = ({ onComplete }) => {
  const [selected, setSelected] = useState({});
  const [checked, setChecked] = useState(false);

  const questions = [
    { q: "Where do you create a Pivot Table?", options: ["Home tab", "Insert tab", "View tab", "File menu"], a: 1 },
    { q: "What should your data have in the first row?", options: ["Numbers", "Column headers", "Formulas", "Nothing"], a: 1 },
    { q: "What do you drag to the Values area?", options: ["Text fields", "Numeric fields to calculate", "Date fields only", "Filter criteria"], a: 1 }
  ];

  const handleCheck = () => {
    setChecked(true);
    if (questions.every((q, i) => selected[i] === q.a)) onComplete();
  };

  return (
    <div className="bg-dark-surface rounded-xl p-4 border border-baby-pink/20">
      <h3 className="text-lg font-bold text-baby-pink mb-3">📝 Pivot Table Quiz</h3>
      {questions.map((q, qi) => (
        <div key={qi} className="mb-4">
          <p className="text-gray-300 text-sm mb-2">{q.q}</p>
          <div className="grid grid-cols-2 gap-2">
            {q.options.map((opt, oi) => (
              <button
                key={oi}
                onClick={() => setSelected({ ...selected, [qi]: oi })}
                className={`p-2 rounded-lg text-xs border transition-all ${
                  checked && oi === q.a ? 'border-green-500 bg-green-900/20 text-green-300' :
                  checked && selected[qi] === oi && oi !== q.a ? 'border-red-500 bg-red-900/20 text-red-300' :
                  selected[qi] === oi ? 'border-baby-pink bg-baby-pink/10 text-white' :
                  'border-dark-border text-gray-400 hover:border-baby-pink/50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button onClick={handleCheck} className="px-4 py-2 bg-baby-pink text-black rounded-lg font-bold text-sm hover:bg-baby-pink-light transition-colors">
        Check Answers
      </button>
    </div>
  );
};

// Sorting Quiz (for lesson 10)
const SortingQuiz = ({ onComplete }) => {
  const [selected, setSelected] = useState({});
  const [checked, setChecked] = useState(false);

  const questions = [
    { q: "Does filtering DELETE data?", options: ["Yes", "No - it only hides rows temporarily"], a: 1 },
    { q: "Can you sort by more than one column?", options: ["No, only one", "Yes, using multi-level sort"], a: 1 },
    { q: "What does * (wildcard) match in a text filter?", options: ["Only one character", "Any number of characters", "Only numbers", "Nothing"], a: 1 }
  ];

  const handleCheck = () => {
    setChecked(true);
    if (questions.every((q, i) => selected[i] === q.a)) onComplete();
  };

  return (
    <div className="bg-dark-surface rounded-xl p-4 border border-baby-pink/20">
      <h3 className="text-lg font-bold text-baby-pink mb-3">📝 Sort & Filter Quiz</h3>
      {questions.map((q, qi) => (
        <div key={qi} className="mb-4">
          <p className="text-gray-300 text-sm mb-2">{q.q}</p>
          <div className="space-y-2">
            {q.options.map((opt, oi) => (
              <button
                key={oi}
                onClick={() => setSelected({ ...selected, [qi]: oi })}
                className={`w-full text-left p-2 rounded-lg text-xs border transition-all ${
                  checked && oi === q.a ? 'border-green-500 bg-green-900/20 text-green-300' :
                  checked && selected[qi] === oi && oi !== q.a ? 'border-red-500 bg-red-900/20 text-red-300' :
                  selected[qi] === oi ? 'border-baby-pink bg-baby-pink/10 text-white' :
                  'border-dark-border text-gray-400 hover:border-baby-pink/50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button onClick={handleCheck} className="px-4 py-2 bg-baby-pink text-black rounded-lg font-bold text-sm hover:bg-baby-pink-light transition-colors">
        Check Answers
      </button>
    </div>
  );
};

// Chart Quiz (for lesson 11)
const ChartQuiz = ({ onComplete }) => {
  const [selected, setSelected] = useState({});
  const [checked, setChecked] = useState(false);

  const questions = [
    { q: "Monthly sales over a year - which chart?", options: ["Pie Chart", "Line Chart", "Scatter Plot"], a: 1 },
    { q: "Budget breakdown percentages - which chart?", options: ["Line Chart", "Bar Chart", "Pie Chart"], a: 2 },
    { q: "Where do you find chart options?", options: ["Home tab", "Insert tab", "View tab"], a: 1 }
  ];

  const handleCheck = () => {
    setChecked(true);
    if (questions.every((q, i) => selected[i] === q.a)) onComplete();
  };

  return (
    <div className="bg-dark-surface rounded-xl p-4 border border-baby-pink/20">
      <h3 className="text-lg font-bold text-baby-pink mb-3">📝 Chart Type Quiz</h3>
      {questions.map((q, qi) => (
        <div key={qi} className="mb-4">
          <p className="text-gray-300 text-sm mb-2">{q.q}</p>
          <div className="flex flex-wrap gap-2">
            {q.options.map((opt, oi) => (
              <button
                key={oi}
                onClick={() => setSelected({ ...selected, [qi]: oi })}
                className={`px-3 py-2 rounded-lg text-xs border transition-all ${
                  checked && oi === q.a ? 'border-green-500 bg-green-900/20 text-green-300' :
                  checked && selected[qi] === oi && oi !== q.a ? 'border-red-500 bg-red-900/20 text-red-300' :
                  selected[qi] === oi ? 'border-baby-pink bg-baby-pink/10 text-white' :
                  'border-dark-border text-gray-400 hover:border-baby-pink/50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button onClick={handleCheck} className="px-4 py-2 bg-baby-pink text-black rounded-lg font-bold text-sm hover:bg-baby-pink-light transition-colors">
        Check Answers
      </button>
    </div>
  );
};

export default InteractiveChallenge;
