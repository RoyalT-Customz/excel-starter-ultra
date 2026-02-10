/**
 * SQLite Database Setup
 * Handles database initialization and provides database connection
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const os = require('os');

// Database file path
// In Electron, use app user data directory; in serverless use /tmp; otherwise use local db folder
let DB_PATH;
if (process.env.ELECTRON_USER_DATA) {
  // Electron app - use user data directory
  const userDataPath = process.env.ELECTRON_USER_DATA;
  const dbDir = path.join(userDataPath, 'db');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  DB_PATH = path.join(dbDir, 'excelstarter.db');
} else if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
  // Serverless environment (Vercel, AWS Lambda) - use /tmp directory (only writable location)
  const tmpDir = os.tmpdir();
  DB_PATH = path.join(tmpDir, 'excelstarter.db');
  console.log('📦 Serverless environment detected - using /tmp for database');
} else {
  // Regular Node.js - use local db folder
  DB_PATH = path.join(__dirname, 'excelstarter.db');
}

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    console.error('Database path:', DB_PATH);
  } else {
    console.log('✅ Connected to SQLite database at:', DB_PATH);
    // Ensure database directory exists
    const dbDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    initializeDatabase();
  }
});

/**
 * Initialize database tables
 * Creates all necessary tables for lessons, quizzes, and user progress
 */
function initializeDatabase() {
  // Lessons table - stores lesson content
  db.run(`
    CREATE TABLE IF NOT EXISTS lessons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      order_index INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating lessons table:', err);
      return;
    }
    
    // User progress table - tracks which lessons users have completed
    db.run(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lesson_id INTEGER NOT NULL,
        user_id TEXT DEFAULT 'default',
        completed BOOLEAN DEFAULT 0,
        completed_at DATETIME,
        FOREIGN KEY (lesson_id) REFERENCES lessons(id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating user_progress table:', err);
        return;
      }
      
      // Quiz questions table
      db.run(`
        CREATE TABLE IF NOT EXISTS quiz_questions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          lesson_id INTEGER NOT NULL,
          question TEXT NOT NULL,
          option_a TEXT NOT NULL,
          option_b TEXT NOT NULL,
          option_c TEXT NOT NULL,
          option_d TEXT NOT NULL,
          correct_answer TEXT NOT NULL,
          explanation TEXT,
          FOREIGN KEY (lesson_id) REFERENCES lessons(id)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating quiz_questions table:', err);
          return;
        }
        
        // Quiz results table - stores user quiz scores
        db.run(`
          CREATE TABLE IF NOT EXISTS quiz_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lesson_id INTEGER NOT NULL,
            user_id TEXT DEFAULT 'default',
            score INTEGER NOT NULL,
            total_questions INTEGER NOT NULL,
            completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (lesson_id) REFERENCES lessons(id)
          )
        `, (err) => {
          if (err) {
            console.error('Error creating quiz_results table:', err);
            return;
          }
          
          // Insert default lessons if they don't exist
          // Call immediately - tables are ready at this point
          insertDefaultLessons();
          insertDefaultQuizQuestions();
        });
      });
    });
  });
}

/**
 * Insert default lessons into the database
 */
function insertDefaultLessons() {
  const lessons = [
    {
      title: 'What is Excel?',
      content: `Excel is a powerful spreadsheet program that helps you organize, calculate, and analyze data. Think of it like a digital notebook with rows and columns where you can store information and make calculations automatically.

**Understanding Spreadsheets:**

A spreadsheet is like a giant table made up of rows and columns. Each intersection is called a "cell" where you can enter data. Excel can handle thousands of rows and columns, making it perfect for organizing large amounts of information.

**Key Benefits:**
- **Organize data in tables:** Keep lists, budgets, schedules, and more in one place
- **Perform calculations with formulas:** Excel does the math for you automatically
- **Create charts and graphs:** Turn numbers into visual charts that are easy to understand
- **Sort and filter information:** Quickly find what you're looking for in large datasets
- **Save your work:** Never lose your data - save it to your computer

**Real-World Examples:**

Excel is used everywhere! Here are some common uses:
- **Personal:** Budgeting, expense tracking, meal planning, workout logs
- **School:** Grade books, assignment trackers, study schedules
- **Work:** Sales reports, inventory lists, employee schedules, project planning
- **Business:** Financial statements, customer databases, sales analysis

**Getting Started:**

When you first open Excel, you'll see a blank grid. Don't worry - it's not as complicated as it looks! Each lesson will teach you one skill at a time, building your confidence step by step.

**Why Learn Excel?**

Excel skills are valuable in almost any job or personal project. Even basic Excel knowledge can save you hours of work and help you make better decisions with your data.`,
      order_index: 1
    },
    {
      title: 'How To Navigate in Excel',
      content: `Learning to navigate Excel efficiently is the first step to becoming comfortable with the program. Once you master navigation, everything else becomes much easier!

**Understanding the Grid:**

Excel is organized like a giant table with rows and columns. Think of it like a map where every location has coordinates:
- **Rows** are horizontal lines numbered 1, 2, 3, 4... (going down)
- **Columns** are vertical lines labeled A, B, C, D... (going across)
- **Cells** are the boxes where rows and columns meet
- Each cell has a unique address like A1 (column A, row 1) or B5 (column B, row 5)

**Moving Around the Spreadsheet:**

**Using the Mouse:**
- **Click any cell** to select it - you'll see a border around it
- **Click and drag** to select multiple cells (a range)
- **Use the scroll bars** on the right and bottom to move around large spreadsheets
- **Click the scroll wheel** on your mouse and drag to pan around quickly

**Using the Keyboard (Faster!):**
- **Arrow Keys (↑ ↓ ← →):** Move one cell at a time in any direction
- **Tab:** Move one cell to the right
- **Shift + Tab:** Move one cell to the left
- **Enter:** Move down one cell
- **Shift + Enter:** Move up one cell
- **Home:** Jump to the beginning of the current row (column A)
- **Ctrl + Home:** Jump to cell A1 (top-left corner)
- **Ctrl + End:** Jump to the last cell with data
- **Page Down:** Scroll down one screen
- **Page Up:** Scroll up one screen
- **Alt + Page Down:** Scroll right one screen
- **Alt + Page Up:** Scroll left one screen

**The Name Box - Quick Navigation:**

The Name Box (top-left, next to the formula bar) shows the address of the currently selected cell. You can also use it to jump to any cell:
1. Click in the Name Box
2. Type a cell address (like Z100 or AA50)
3. Press Enter
4. Excel jumps directly to that cell!

**Navigating Between Sheets:**

Excel workbooks can have multiple sheets (tabs at the bottom):
- **Click a sheet tab** to switch to that sheet
- **Ctrl + Page Down:** Move to the next sheet
- **Ctrl + Page Up:** Move to the previous sheet
- **Right-click sheet tabs** to rename, add, delete, or reorder sheets

**Selecting Multiple Cells:**

**Select a Range:**
- Click and drag from one cell to another
- Or click the first cell, hold Shift, and click the last cell

**Select an Entire Row:**
- Click the row number on the left (1, 2, 3...)
- Or press Shift + Spacebar

**Select an Entire Column:**
- Click the column letter at the top (A, B, C...)
- Or press Ctrl + Spacebar

**Select All Cells:**
- Press Ctrl + A (selects all cells with data)
- Press Ctrl + A twice to select absolutely everything
- Or click the corner button above row 1 and left of column A

**Using Find and Go To:**

**Find (Ctrl + F):**
- Quickly locate specific text or numbers in your spreadsheet
- Press Ctrl + F to open the Find dialog
- Type what you're looking for and press Enter
- Excel highlights matching cells

**Go To (Ctrl + G or F5):**
- Jump to a specific cell address quickly
- Press Ctrl + G or F5
- Type a cell address (like E50) and press Enter
- Great for navigating large spreadsheets

**View Options:**

**Zoom:**
- Use the zoom slider in the bottom-right corner
- Or press Ctrl + Mouse Scroll Wheel
- Zoom in to see details, zoom out to see the big picture

**Freeze Panes:**
- Keep headers visible while scrolling
- Go to View → Freeze Panes
- Useful for large datasets where you want to always see column headers

**Split Window:**
- View different parts of the same sheet simultaneously
- Go to View → Split
- Creates separate panes you can scroll independently

**Keyboard Shortcuts Cheat Sheet:**

**Navigation:**
- **Arrow Keys:** Move cell by cell
- **Ctrl + Arrow:** Jump to the edge of data in that direction
- **Ctrl + Home:** Go to A1
- **Ctrl + End:** Go to last cell with data
- **Page Down/Up:** Scroll one screen
- **Ctrl + G (or F5):** Go to specific cell
- **Ctrl + F:** Find text

**Selection:**
- **Shift + Arrow:** Extend selection
- **Ctrl + A:** Select all
- **Shift + Space:** Select entire row
- **Ctrl + Space:** Select entire column

**Practice Exercises:**

1. Open Excel and practice moving around:
   - Use arrow keys to move from A1 to Z1
   - Use Ctrl + Arrow to jump to the edges
   - Click the Name Box and type "X50" then press Enter

2. Practice selecting:
   - Select cells A1 to D10 using click and drag
   - Select an entire row by clicking the row number
   - Select an entire column by clicking the column letter

3. Practice with multiple sheets:
   - Create a new sheet (click the + button)
   - Switch between sheets using Ctrl + Page Down/Up

**Pro Tips:**

1. **Master Keyboard Navigation:** Once you get comfortable with keyboard shortcuts, you'll work much faster than using just the mouse.

2. **Use Name Box for Large Spreadsheets:** When working with big files, typing a cell address in the Name Box is often faster than scrolling.

3. **Combine Mouse and Keyboard:** Use the mouse for pointing and clicking, but keyboard shortcuts for navigation. This hybrid approach is most efficient.

4. **Freeze Headers:** Always freeze the top row when working with data tables so you can always see your column headers while scrolling.

5. **Zoom for Comfort:** Don't be afraid to zoom in if text is too small, or zoom out to see more data at once.

Remember: Practice makes perfect! The more you navigate Excel, the more natural it will feel. Start with the basics and gradually add keyboard shortcuts to your workflow.`,
      order_index: 2
    },
    {
      title: 'Excel Interface (Cells, Rows, Columns, Ribbon)',
      content: `Let's explore the Excel interface step by step. Don't worry - we'll go through each part slowly!

**The Grid System:**

![Excel Interface Overview](images/excel-interface.png)

**Cells:** These are the small boxes where you type data. Each cell has a unique address made up of its column letter and row number. For example:
- The cell in column A, row 1 is called "A1"
- The cell in column B, row 3 is called "B3"
- Think of it like coordinates on a map!

**Rows:** These are horizontal lines of cells, numbered 1, 2, 3, and so on. Each row can contain multiple cells across different columns. Rows are perfect for organizing related information horizontally - like one row per person in a contact list.

**Columns:** These are vertical lines of cells, labeled A, B, C, continuing to Z, then AA, AB, and so on. Columns help you organize similar types of data. For example, you might put all names in column A and all phone numbers in column B.

**The Ribbon:**

![Excel Ribbon](images/excel-ribbon.png)

The Ribbon is the toolbar at the top of Excel with buttons for everything you need. It's organized into tabs:
- **Home:** Most common tools (formatting, copying, pasting)
- **Insert:** Add charts, pictures, tables
- **Page Layout:** Control how your spreadsheet looks when printed
- **Formulas:** Access to all Excel functions
- **Data:** Tools for sorting, filtering, and analyzing data
- **Review:** Spell check and comments
- **View:** Change how you see your spreadsheet

**Other Important Parts:**

**Formula Bar:** Located just below the Ribbon, this shows what's actually inside the selected cell. If a cell contains a formula, you'll see the formula here. If it contains text or a number, you'll see that value. You can also edit cell contents directly in the formula bar.

**Name Box:** Next to the formula bar, this shows the address of the currently selected cell. You can also type a cell address here and press Enter to jump to that cell quickly.

**Sheet Tabs:** At the bottom of the screen, you'll see tabs for different sheets in your workbook. Think of sheets like pages in a notebook - you can organize different types of data on different sheets, all within the same file. Click a tab to switch to that sheet.

**Status Bar:** At the very bottom, the status bar shows useful information like the average, count, and sum of selected cells.

**Quick Access Toolbar:** Located above the Ribbon, this customizable toolbar lets you add your most frequently used commands for quick access.

**Practice Tip:** Take a moment to click around and explore. Notice how clicking different cells updates the formula bar and name box. Try clicking different tabs on the Ribbon to see what tools are available. This hands-on exploration will help you feel comfortable navigating Excel!`,
      order_index: 3
    },
    {
      title: 'Entering Data',
      content: `Entering data in Excel is simple and intuitive. Once you master the basics, you'll be able to input information quickly and efficiently.

**Basic Data Entry Steps:**

![Entering Data in Excel](images/entering-data.png)

1. **Click a cell** to select it - You'll see a border around the cell indicating it's selected
2. **Type your data** - You can enter text, numbers, dates, or formulas
3. **Press Enter** - This saves your data and moves down to the next row
4. **Or press Tab** - This saves your data and moves to the next column (right)

**Different Types of Data:**

**Text:** Any words or letters. Excel will automatically align text to the left side of the cell. Examples: "John Smith", "Product A", "Notes"

**Numbers:** Excel recognizes numbers and aligns them to the right. You can enter:
- Whole numbers: 10, 250, 1000
- Decimals: 10.5, 99.99, 3.14159
- Percentages: 50% (Excel will format it)
- Currency: $10.00, €25.50

**Dates:** Enter dates in various formats and Excel will recognize them:
- 1/15/2024
- January 15, 2024
- 15-Jan-2024
- Excel will automatically format dates consistently

**Editing Your Data:**

- **Double-click a cell** to edit it directly in place
- **Click once and use the formula bar** to edit - useful for long text or complex formulas
- **Select a cell and press F2** - This also allows you to edit
- **Press Escape** to cancel what you're typing without saving changes

**Moving Between Cells:**

- **Arrow keys** - Move up, down, left, or right one cell at a time
- **Tab** - Move right to the next column
- **Shift + Tab** - Move left to the previous column
- **Enter** - Move down to the next row
- **Shift + Enter** - Move up to the previous row

**Selecting Multiple Cells:**

- **Click and drag** to select a range of cells
- **Click a row number** to select the entire row
- **Click a column letter** to select the entire column
- **Ctrl + A** selects all cells in the worksheet

**Pro Tips:**

1. **AutoFill:** Enter data in one cell, then click and drag the small square in the bottom-right corner of the cell to fill adjacent cells. Excel can automatically continue patterns like numbers (1, 2, 3...) or dates.

2. **Copy and Paste:** Use Ctrl+C to copy and Ctrl+V to paste. Excel also supports multiple formats when pasting.

3. **Undo/Redo:** Made a mistake? Press Ctrl+Z to undo. Ctrl+Y to redo.

4. **Quick Entry:** You can enter data in multiple cells quickly by selecting a range, typing your data, and pressing Ctrl+Enter to fill all selected cells.

Practice entering different types of data to get comfortable with the process!`,
      order_index: 4
    },
    {
      title: 'Formatting (Bold, Colors, Borders)',
      content: `Make your spreadsheet look professional and easy to read with formatting. Good formatting makes your data clearer and your spreadsheets more impressive.

**Text Formatting:**

![Formatting Tools](images/formatting-tools.png)

**Bold Text:** Select cells → Click the **B** button in the ribbon (or press Ctrl+B)
- Use bold for headers and important information
- Makes text stand out and easier to scan

**Italic Text:** Select cells → Click the **I** button (or press Ctrl+I)
- Use for emphasis or special notes

**Underline:** Select cells → Click the **U** button (or press Ctrl+U)
- Less commonly used in spreadsheets, but useful for hyperlinks

**Font Size:** Select cells → Choose a size from the dropdown menu
- Headers typically use 12-16pt
- Body text is usually 10-11pt
- Make important data larger for emphasis

**Font Style:** Change the font type (Arial, Calibri, Times New Roman, etc.)
- Stick to professional fonts like Calibri, Arial, or Cambria
- Avoid decorative fonts in business spreadsheets

**Cell Colors:**

**Fill Color (Background):** Select cells → Click the paint bucket icon → Choose a color
- Use light colors for headers to distinguish them from data
- Alternate row colors (zebra stripes) make large tables easier to read
- Use colors sparingly - too many colors look unprofessional

**Font Color:** Select cells → Click the "A" with colored underline → Choose a color
- Typically use dark colors (black, dark blue) for readability
- Use red for warnings or negative numbers
- Use green for positive indicators

**Borders:**

Select cells → Click the border icon (dropdown arrow) → Choose a border style
- **All Borders:** Adds borders around all selected cells
- **Outside Borders:** Adds border only around the selection
- **Thick Box Border:** Makes a prominent border around the selection
- **Bottom Border:** Common for underlining headers

**Alignment:**

Use the alignment buttons to position text within cells:
- **Left Align:** Default for text
- **Center Align:** Good for headers and centered data
- **Right Align:** Default for numbers (makes decimals line up nicely)
- **Top/Middle/Bottom:** Vertical alignment within cells

**Number Formatting:**

**Currency:** Select cells → Click $ icon or format as Currency
- Automatically adds $ sign and decimal places

**Percentage:** Select cells → Click % icon
- Converts decimals to percentages

**Comma Style:** Select cells → Click comma icon
- Adds thousand separators (1,000 instead of 1000)

**Decimal Places:** Increase or decrease decimal places using .00 buttons

**Professional Formatting Tips:**

1. **Consistency is Key:** Use the same formatting for similar elements throughout your spreadsheet

2. **Headers First:** Format your column headers differently (bold, larger font, colored background) to distinguish them from data

3. **Don't Overdo It:** Too much formatting can be distracting. Keep it clean and professional

4. **Use Borders Wisely:** Borders help separate sections but use them consistently

5. **Color Coding:** Use colors meaningfully - for example, green for positive values, red for negative

6. **Format Painter:** Once you create a good formatting style, use the Format Painter (paintbrush icon) to copy it to other cells

**Keyboard Shortcuts:**
- Ctrl+B: Bold
- Ctrl+I: Italic
- Ctrl+U: Underline
- Ctrl+1: Open Format Cells dialog box (for advanced options)

Practice formatting to make your spreadsheets look professional!`,
      order_index: 5
    },
    {
      title: 'Simple Formulas (SUM, MIN, MAX)',
      content: `Formulas are what make Excel powerful! They help you calculate numbers automatically, so you never have to do math manually again. When your data changes, Excel automatically updates the results.

**Understanding Formulas:**

**Always start with =** (equals sign). This tells Excel you're entering a formula, not text. If you forget the equals sign, Excel will treat it as text and won't calculate anything.

**Basic Math Operations:**

You can do simple math in Excel:
- Addition: =A1+A2 (adds cell A1 and A2)
- Subtraction: =A1-A2
- Multiplication: =A1*A2 (use * for multiply)
- Division: =A1/A2 (use / for divide)
- Power: =A1^2 (raises A1 to the power of 2)

**Essential Functions:**

**MIN:** Finds the smallest number
- Example: =MIN(A1:A5) shows the minimum value in the range
- Useful for finding the lowest price, smallest amount, earliest date, etc.

**MAX:** Finds the largest number
- Example: =MAX(A1:A5) shows the maximum value in the range
- Useful for finding the highest score, maximum value, latest date, etc.

**COUNT:** Counts how many cells contain numbers
- Example: =COUNT(A1:A10) counts cells with numbers
- **COUNTA:** Counts all non-empty cells (text or numbers)

**Using Cell References:**

Instead of typing numbers directly, use cell references (like A1, B2):
- **Relative References:** =A1+B1 (changes when copied to other cells)
- **Absolute References:** =$A$1+$B$1 (stays the same when copied - use $ to lock)
- **Mixed References:** =$A1 or =A$1 (locks either row or column)

**Creating Formulas Step by Step:**

1. Click the cell where you want the result
2. Type = (equals sign)
3. Type the function name (MIN, MAX, etc.)
4. Type an opening parenthesis (
5. Select the range of cells or type the cell addresses
6. Type a closing parenthesis )
7. Press Enter

**Example Practice Scenarios:**

**Scenario 1: Grade Book**
- Column A: Student names
- Columns B-E: Test scores
- Cell B12: =MAX(B2:B11) to find highest test score
- Cell B13: =MIN(B2:B11) to find lowest test score

**Common Formula Errors:**

- **#VALUE!** - Trying to do math with text
- **#DIV/0!** - Dividing by zero
- **#REF!** - Referencing a cell that doesn't exist
- **#NAME?** - Typo in function name (like "SM" instead of "SUM")

**Pro Tips:**

1. **AutoFill Formulas:** Create a formula once, then drag the fill handle (small square in bottom-right) to copy it to other rows - Excel automatically adjusts cell references!

2. **Show Formulas:** Press Ctrl+\` (backtick) to see all formulas instead of results

3. **Function Wizard:** Press Shift+F3 to open the function wizard if you forget the syntax

4. **Smart Suggestions:** As you type, Excel shows suggested functions - press Tab to accept them

These functions help you analyze your data quickly!`,
      order_index: 6
    },
    {
      title: 'Basic Math Formulas - SUM',
      content: `The SUM function is one of the most important and commonly used formulas in Excel. It adds up numbers automatically, saving you time and preventing calculation errors. Let's master it!

**What is SUM?**

SUM adds together all the numbers in a specified range or list of cells. Instead of typing =A1+A2+A3+A4+A5, you can simply write =SUM(A1:A5) - much easier!

**Basic SUM Syntax:**

=SUM(cell1, cell2, cell3...)
or
=SUM(range)

**Simple Examples:**

**Adding Specific Cells:**
- =SUM(A1, A2, A3) - Adds cells A1, A2, and A3
- =SUM(B5, D5, F5) - Adds specific cells from different columns

**Adding a Range:**
- =SUM(A1:A10) - Adds all numbers from A1 through A10
- =SUM(B2:B20) - Adds all numbers in column B from row 2 to 20

**Adding Multiple Ranges:**
- =SUM(A1:A5, C1:C5) - Adds range A1:A5 plus range C1:C5
- =SUM(B2:B10, D2:D10, F2:F10) - Adds three separate ranges

**Using the AutoSum Button:**

Excel makes it even easier with the AutoSum button (Σ) on the Home tab:

1. Click the cell where you want the total
2. Click the **AutoSum** button (Σ) in the Home tab
3. Excel automatically detects the range above or to the left
4. Press Enter to confirm

**AutoSum Tips:**
- If Excel guesses wrong, you can manually adjust the range
- AutoSum works best when there's a clear pattern (like a column of numbers with a header)

**Real-World Examples:**

**Example 1: Monthly Budget**
- Column A: Expense categories (Rent, Food, Utilities...)
- Column B: Amounts ($800, $300, $150...)
- Cell B15: =SUM(B2:B14) - Totals all expenses

**Example 2: Sales Report**
- Rows 2-13: Monthly sales (January through December)
- Column B: Sales amounts
- Cell B14: =SUM(B2:B13) - Total yearly sales

**Example 3: Shopping List**
- Column A: Items (Milk, Bread, Eggs...)
- Column B: Prices ($3.50, $2.00, $4.50...)
- Cell B10: =SUM(B2:B9) - Total cost of groceries

**Example 4: Test Scores**
- Rows 2-31: Students
- Columns B-F: Individual test scores
- Column G: =SUM(B2:F2) - Each student's total points

**Tips for Using SUM:**

1. **Always Check Your Range:** Make sure the range includes all cells you want to add. Watch for:
   - Blank cells in the middle (they're ignored - that's fine!)
   - Text in the range (ignored - won't cause errors)
   - Cells with formulas (their calculated values are included)

2. **Include Headers?** Usually you don't want to include header rows in your sum. Start your range below the headers.

3. **Updating Totals:** When you add or change numbers in your range, the SUM automatically updates - that's the magic of formulas!

4. **Visual Check:** After creating a SUM formula, quickly verify it looks correct by checking the range highlight Excel shows.

**Common SUM Errors:**

**#VALUE! Error:**
- Usually means there's text in a cell that Excel tried to add
- Solution: Check your range for text that looks like numbers

**Wrong Total:**
- Double-check that your range includes all the cells you want
- Make sure you didn't accidentally include or exclude a cell

**Best Practices:**

1. **Use SUM Instead of Adding:** Don't write =A1+A2+A3+A4. Use =SUM(A1:A4) instead. It's:
   - Easier to read
   - Easier to modify
   - Less prone to errors
   - Works better with large ranges

2. **Keep Your Data Organized:** SUM works best when your numbers are in neat rows or columns without gaps.

3. **Label Your Totals:** Always label your SUM cells clearly, like "Total" or "Grand Total" in the cell next to or above it.

4. **Use Consistent Formatting:** Format your total cells consistently (like bold and a border) so they stand out.

**Practice Exercises:**

1. Create a simple budget:
   - List 5 expenses in column A
   - Enter amounts in column B
   - Use SUM to total them in cell B7

2. Create a grade sheet:
   - List 5 assignments in column A
   - Enter scores in column B
   - Use SUM to calculate total points

3. Practice with AutoSum:
   - Enter numbers in cells A1 through A10
   - Click cell A11 and use the AutoSum button
   - Watch how Excel detects the range automatically

**Keyboard Shortcut:**

- **Alt + =** - Quick way to insert AutoSum (even faster than clicking the button!)

Remember: SUM is your best friend in Excel. Once you master it, you'll use it constantly. Practice with real data from your own projects to get comfortable!`,
      order_index: 7
    },
    {
      title: 'How to Write Formulas',
      content: `Writing formulas is one of the most powerful skills in Excel. Once you understand the basics, you can create formulas for almost any calculation you need. Let's break it down step by step!

**The Golden Rule:**

**All formulas must start with an equals sign (=)**

This is crucial! Without the = sign, Excel treats what you type as text, not a calculation. For example:
- Wrong: SUM(A1:A5) - Excel sees this as text
- Right: =SUM(A1:A5) - Excel calculates this

**Formula Components:**

A formula can contain:
1. **Operators:** + (add), - (subtract), * (multiply), / (divide), ^ (power)
2. **Cell References:** A1, B2, C10 (addresses of cells)
3. **Functions:** SUM, MIN, MAX, etc. (pre-built calculations)
4. **Numbers:** Direct values like 5, 10.5, -3
5. **Text:** Always in quotes, like "Hello"

**Basic Math Formulas:**

**Addition:**
- =A1+A2 (adds values in A1 and A2)
- =A1+B1+C1 (adds three cells)
- =5+10 (adds the numbers 5 and 10 directly)

**Subtraction:**
- =A1-A2 (subtracts A2 from A1)
- =100-B1 (subtracts B1 from 100)

**Multiplication:**
- =A1*A2 (multiplies A1 by A2)
- Note: Use * (asterisk), not x or ×

**Division:**
- =A1/A2 (divides A1 by A2)
- Note: Use / (forward slash), not ÷

**Order of Operations:**

Excel follows math rules (PEMDAS):
- Parentheses first
- Exponents (^)
- Multiplication and Division (left to right)
- Addition and Subtraction (left to right)

**Examples:**
- =2+3*4 equals 14 (multiplication happens first: 3*4=12, then 2+12=14)
- =(2+3)*4 equals 20 (parentheses first: 2+3=5, then 5*4=20)

**Using Cell References:**

Instead of typing numbers directly, reference cells so your formulas update automatically:

**Good:**
- =A1+B1 (uses cell values - updates if cells change)

**Not Recommended:**
- =5+10 (hard-coded numbers - won't update automatically)

**Relative vs Absolute References:**

**Relative References (Default):**
- =A1+B1
- When you copy this formula, Excel adjusts it automatically
- Copying down: =A2+B2, =A3+B3, etc.
- Copying right: =B1+C1, =C1+D1, etc.

**Absolute References (Fixed):**
- =$A$1+$B$1
- The $ locks the reference - it never changes when copied
- Useful when you always want to reference the same cell (like a tax rate or constant)

**Mixed References:**
- =$A1 (column A is locked, row changes)
- =A$1 (row 1 is locked, column changes)

**Using Functions in Formulas:**

Functions are pre-built calculations:

**Simple Functions:**
- =SUM(A1:A5) - Adds numbers
- =MAX(A1:A5) - Finds largest number
- =MIN(A1:A5) - Finds smallest number
- =COUNT(A1:A5) - Counts numbers

**Combining Functions:**
- =SUM(A1:A5)+SUM(B1:B5) - Adds two ranges
- =MAX(A1:A10)-MIN(A1:A10) - Range calculation

**Step-by-Step: Writing Your First Formula:**

**Example: Calculate Total with Tax**

1. Click the cell where you want the result (let's say C2)
2. Type = (equals sign)
3. Click on the cell with the subtotal (B2) - you'll see B2 appear in your formula
4. Type * (multiply)
5. Type 1.08 (for 8% tax - 1 + 0.08)
6. Your formula should look like: =B2*1.08
7. Press Enter
8. Excel calculates and shows the result!

**Better Version with Absolute Reference:**

1. Put the tax rate in a cell (like E1 = 0.08)
2. In C2, type: =B2*(1+$E$1)
3. Now you can copy this formula down, and it will always use the tax rate from E1

**Common Formula Patterns:**

**Adding a Percentage:**
- Original value in A1, increase by 10%: =A1*1.10
- Or: =A1*(1+0.10)

**Calculating a Percentage:**
- Part in A1, Whole in B1: =A1/B1
- Display as percentage: Format cell as Percentage

**Averages:**
- =SUM(A1:A10)/10 (manually calculating average)
- Or use: =AVERAGE(A1:A10) if you want to use that function

**Difference:**
- Old value in A1, New value in B1: =B1-A1
- Percentage change: =(B1-A1)/A1

**Editing Formulas:**

**Method 1: Double-Click**
- Double-click the cell with the formula
- Make your changes
- Press Enter

**Method 2: Formula Bar**
- Click the cell with the formula
- Click in the formula bar at the top
- Make your changes
- Press Enter

**Method 3: F2 Key**
- Click the cell with the formula
- Press F2
- Make your changes
- Press Enter

**Common Formula Mistakes:**

1. **Forgetting the = Sign:**
   - Wrong: SUM(A1:A5)
   - Right: =SUM(A1:A5)

2. **Missing Parentheses:**
   - Wrong: =A1+B1*C1 (might not calculate as expected)
   - Right: =(A1+B1)*C1 (if you want sum first)

3. **Wrong Cell References:**
   - Double-check that your references point to the correct cells
   - Use the colored highlights Excel shows to verify

4. **Dividing by Zero:**
   - =A1/0 causes #DIV/0! error
   - Always check your divisor isn't zero

**Formula Best Practices:**

1. **Start Simple:** Build complex formulas step by step
   - First: =A1+B1
   - Then add: =A1+B1+C1
   - Then: =A1+B1+C1*1.08

2. **Use Parentheses:** When in doubt, use parentheses to clarify order
   - =(A1+B1)*C1 is clearer than =A1+B1*C1

3. **Test with Known Values:** Try your formula with numbers you know the answer to
   - Test =A1+B1 with A1=5, B1=3 - should equal 8

4. **Break Complex Formulas:** Instead of one huge formula, use helper cells
   - Calculate intermediate steps in separate cells
   - Reference those cells in your final formula

5. **Document Your Formulas:** Add comments or notes explaining what complex formulas do

**Keyboard Shortcuts:**

- **F2:** Edit formula in current cell
- **Esc:** Cancel editing (don't save changes)
- **Ctrl + `** (backtick): Show all formulas instead of results
- **Ctrl + Enter:** Enter formula in multiple selected cells

**Practice Exercises:**

1. **Simple Addition:**
   - Put 5 in A1, 10 in B1
   - In C1, write: =A1+B1
   - Should show 15

2. **Calculate Total Cost:**
   - Put quantity in A1 (like 5)
   - Put price in B1 (like 10.50)
   - In C1, write: =A1*B1
   - Should calculate total

3. **Add Percentage:**
   - Put 100 in A1
   - In B1, write: =A1*1.15 (adds 15%)
   - Should show 115

4. **Combined Calculation:**
   - Quantity in A1, Price in B1
   - In C1, write: =A1*B1*1.08 (calculates total with 8% tax)

Remember: Practice makes perfect! Start with simple formulas and gradually build more complex ones. Every Excel expert started exactly where you are now!`,
      order_index: 8
    },
    {
      title: 'Pivot Tables',
      content: `Pivot Tables are one of Excel's most powerful features for analyzing large amounts of data. They let you quickly summarize, analyze, and explore your data from different angles without writing complex formulas. Think of them as interactive summary reports!

**What is a Pivot Table?**

A Pivot Table is an interactive table that automatically summarizes and analyzes data from your spreadsheet. It can:
- Count, sum, average, or perform other calculations
- Group data by categories (dates, products, regions, etc.)
- Show different views of the same data instantly
- Help you discover patterns and trends

**What Are Pivot Tables Used For?**

Pivot Tables are perfect for:
- **Sales Analysis:** Total sales by product, region, or time period
- **Budget Analysis:** Compare actual vs. planned expenses by category
- **Survey Results:** Count responses by question or demographic
- **Inventory Management:** Summarize stock levels by category or location
- **Time Tracking:** Analyze hours worked by employee, project, or date
- **Financial Reports:** Create quick summaries from detailed transaction data

**When to Use Pivot Tables:**

Use Pivot Tables when you have:
- Large amounts of data (hundreds or thousands of rows)
- Data organized in a table format with headers
- Need to summarize or analyze data in different ways
- Want to quickly explore your data without writing formulas

**Creating Your First Pivot Table:**

**Step 1: Prepare Your Data**

Your data should be organized like this:
- First row contains column headers (like "Product", "Date", "Sales", "Region")
- Each row represents one record (one sale, one transaction, etc.)
- No blank rows or columns in your data
- Consistent data format (dates as dates, numbers as numbers)

**Example Data Setup:**
```
Product    | Date       | Sales | Region
-----------|------------|-------|----------
Widget A   | 1/1/2024   | 100   | North
Widget B   | 1/1/2024   | 150   | South
Widget A   | 1/2/2024   | 120   | North
Widget B   | 1/2/2024   | 180   | South
```

**Step 2: Select Your Data**

1. Click anywhere in your data table
2. Or select the entire range (including headers)
3. Make sure all your data is selected

**Step 3: Create the Pivot Table**

1. Go to the **Insert** tab in the ribbon
2. Click **PivotTable** (usually the first button, left side)
3. A dialog box appears
4. Excel automatically selects your data (you can verify the range)
5. Choose where to place the Pivot Table:
   - **New Worksheet** (recommended for beginners)
   - **Existing Worksheet** (choose a location)
6. Click **OK**

**Step 4: Build Your Pivot Table**

You'll see the Pivot Table Field List on the right side:
- **Fields:** Shows all your column headers
- **Four Areas:** Filters, Columns, Rows, Values

**Understanding the Areas:**

**Rows:** Categories you want to group by (e.g., Product names, Regions)
- Drag field names here to create rows
- Each unique value becomes a row in your table

**Columns:** Categories to show across the top (e.g., Months, Regions)
- Optional - you can leave this empty
- Creates columns based on unique values

**Values:** What you want to calculate (e.g., Sum of Sales, Count of Orders)
- Drag numeric fields here
- Excel automatically uses SUM, but you can change to COUNT, AVERAGE, etc.

**Filters:** Optional filters to show specific data (e.g., Show only 2024 data)
- Drag fields here to filter the entire Pivot Table

**Step 5: Drag and Drop**

1. Drag "Product" to the **Rows** area - you'll see each product listed
2. Drag "Sales" to the **Values** area - Excel automatically sums sales for each product
3. That's it! You now have a summary showing total sales per product

**Real-World Example:**

**Goal: Total Sales by Product and Region**

1. Create Pivot Table from your sales data
2. Drag "Product" to **Rows**
3. Drag "Region" to **Columns**
4. Drag "Sales" to **Values**
5. Result: A table showing sales totals for each product/region combination!

**Changing Calculations:**

By default, Excel sums numbers. To change:

1. Click the drop-down arrow on your field in the Values area
2. Choose "Value Field Settings"
3. Select the calculation you want:
   - **Sum:** Adds all values
   - **Count:** Counts items
   - **Average:** Calculates average
   - **Max:** Shows maximum value
   - **Min:** Shows minimum value
4. Click OK

**Updating Your Pivot Table:**

When your original data changes:
1. Click anywhere in your Pivot Table
2. Go to the **PivotTable Analyze** tab (appears when Pivot Table is selected)
3. Click **Refresh** button
4. Your Pivot Table updates with new data

**Filtering Pivot Tables:**

**Filter by Field:**
- Click the drop-down arrow next to any row or column label
- Check/uncheck items to show or hide them
- Click OK

**Using Slicers (Visual Filters):**

1. Click in your Pivot Table
2. Go to **PivotTable Analyze** tab
3. Click **Insert Slicer**
4. Select the fields you want to filter by
5. Click OK
6. Buttons appear - click them to filter your data visually!

**Formatting Your Pivot Table:**

1. Click in your Pivot Table
2. Use the **PivotTable Design** tab (appears when selected)
3. Choose a style from the gallery
4. Options for:
   - Banded rows (alternating colors)
   - Different color schemes
   - Subtotals and grand totals

**Common Pivot Table Tasks:**

**Show Percentages Instead of Numbers:**
1. Right-click a number in your Values area
2. Choose "Show Values As"
3. Select "% of Grand Total" or other percentage option

**Group Dates:**
1. Right-click a date in your Rows
2. Choose "Group"
3. Select grouping (Days, Months, Years, etc.)
4. Click OK

**Sort Your Data:**
- Click the drop-down arrow on any row or column label
- Choose "Sort A to Z" or "Sort Largest to Smallest"

**Tips for Success:**

1. **Start Simple:** Begin with one field in Rows and one in Values. Add complexity gradually.

2. **Clean Your Data First:** Make sure your data is well-organized before creating a Pivot Table.

3. **Use Descriptive Headers:** Your column headers should clearly describe what each column contains.

4. **No Blank Rows:** Remove any completely blank rows from your source data.

5. **Refresh Regularly:** Always refresh your Pivot Table after updating source data.

6. **Practice with Sample Data:** Create some simple sample data and practice building different Pivot Tables to get comfortable.

**When Not to Use Pivot Tables:**

- Very small datasets (under 10 rows) - regular formulas might be simpler
- Data that changes structure frequently
- When you need complex calculations not available in Pivot Tables

**Common Mistakes:**

1. **Not Including Headers:** Always make sure your first row has column headers
2. **Selecting Wrong Range:** Double-check that all your data is included
3. **Forgetting to Refresh:** After changing source data, refresh your Pivot Table
4. **Too Many Fields:** Start with 2-3 fields, then add more as needed

**Practice Exercise:**

1. Create sample data:
   - Column A: Product (Widget A, Widget B, Widget C - repeat several times)
   - Column B: Date (various dates in January 2024)
   - Column C: Sales (various amounts like 100, 150, 200)
   - Column D: Region (North, South, East, West - mix them up)

2. Create a Pivot Table:
   - Total sales by product
   - Total sales by region
   - Total sales by product AND region
   - Average sales by product

Pivot Tables might seem complex at first, but with practice, they become one of your most valuable Excel tools. Start simple and experiment - that's the best way to learn!`,
      order_index: 9
    },
    {
      title: 'Sorting & Filtering',
      content: `Sorting and filtering are powerful tools that help you organize and find information quickly in large datasets. They're essential for working with any spreadsheet that has more than a few rows of data.

**Sorting Data:**

Sorting arranges your data in a specific order, making it easier to find what you're looking for.

**Simple Sort:**
1. Select your data (including headers if you have them)
2. Go to the Data tab in the ribbon
3. Click "Sort A to Z" (ascending) or "Sort Z to A" (descending)
4. Excel will sort the selected column while keeping rows together

**Multiple Column Sort:**

Sometimes you want to sort by more than one column. For example, sort by last name, then by first name:
1. Select your data
2. Click "Sort" button (opens Sort dialog)
3. Choose your primary sort column
4. Click "Add Level" to add another sort criterion
5. Choose your secondary sort column
6. Click OK

**Sort Options:**
- **Values:** Sort by numbers or text (default)
- **Cell Color:** Sort by cell background color
- **Font Color:** Sort by text color
- **Cell Icon:** Sort by conditional formatting icons

**Important Notes:**
- Always include headers in your selection when sorting
- Excel will keep entire rows together when sorting
- Be careful not to sort partial data - select all columns you need to stay together

**Filtering Data:**

Filtering temporarily hides rows that don't meet certain criteria, allowing you to focus on specific information.

**Turn On Filters:**
1. Select your data (including headers)
2. Click the "Filter" button in the Data tab
3. Small dropdown arrows appear in your header row

**Using Filters:**
1. Click the dropdown arrow in any column header
2. You'll see all unique values in that column with checkboxes
3. Uncheck items you want to hide
4. Click OK
5. Only rows matching your criteria will be visible
6. The row numbers turn blue to show filtering is active

**Filter Options:**

**Text Filters:**
- Equals, Does Not Equal
- Contains, Does Not Contain
- Begins With, Ends With
- Custom Filter (for complex criteria)

**Number Filters:**
- Equals, Does Not Equal
- Greater Than, Less Than
- Between, Top 10
- Above Average, Below Average

**Date Filters:**
- Today, Tomorrow, Yesterday
- This Week, Last Week
- Next Month, Last Month
- Custom Date Range

**Clear Filters:**
- Click "Clear" in the Data tab to remove all filters
- Click individual dropdown arrows and select "Clear Filter From [Column]"
- The filter button toggles on/off - click it again to remove all filters

**Advanced Filtering Tips:**

1. **Multiple Filters:** You can filter multiple columns at once. Apply a filter to one column, then apply another filter to a different column - Excel shows only rows that meet BOTH criteria.

2. **Wildcards:** In text filters, use:
   - * (asterisk) for any number of characters
   - ? (question mark) for a single character
   - Example: "Smith*" finds "Smith", "Smithson", "Smithfield"

3. **Filtered Data Calculations:** Formulas like SUM and AVERAGE work on visible (filtered) data only, making it easy to calculate totals for filtered results.

4. **Copy Filtered Data:** When you copy filtered data, only visible rows are copied - perfect for extracting specific subsets of information.

**Real-World Examples:**

**Sorting Examples:**
- Sort sales data by amount (highest to lowest) to see top sellers
- Sort customer list alphabetically by last name
- Sort tasks by due date to prioritize work
- Sort expenses by category, then by amount within each category

**Filtering Examples:**
- Filter products to show only items with "Low Stock" status
- Filter sales to show only transactions from last month
- Filter employees to show only those in a specific department
- Filter grades to show only students scoring above 80%

**Pro Tips:**

1. **Quick Sort:** Right-click on a column header and choose "Sort" for quick access
2. **Remove Duplicates:** Use the "Remove Duplicates" tool (Data tab) to clean your data before sorting/filtering
3. **Sort Warning:** If Excel warns that it detected adjacent data, make sure you've selected all columns that should stay together
4. **Filters Don't Delete:** Filtering hides rows but doesn't delete them - your data is safe!

Master sorting and filtering to work efficiently with large datasets!`,
      order_index: 10
    },
    {
      title: 'Creating Charts',
      content: `Charts transform your numbers into visual stories that are easy to understand at a glance. They help you identify trends, compare values, and communicate your data effectively to others.

**Why Use Charts?**

Charts make it easy to:
- See patterns and trends that aren't obvious in raw numbers
- Compare values quickly
- Spot outliers or unusual data points
- Present information to others in a clear, professional way
- Make data-driven decisions more confidently

**Creating a Chart:**

![Creating Charts in Excel](images/creating-charts.png)

1. **Select your data** - Include headers and all data you want to chart
   - Make sure your data is well-organized with clear headers
   - For best results, data should be in adjacent columns or rows

2. **Click the Insert tab** in the ribbon

3. **Choose a chart type:**
   - **Recommended Charts** - Excel suggests the best chart type for your data
   - **Charts** section - Browse different chart categories
   - Common types include Column, Line, Pie, Bar, Area, and Scatter

4. **Excel creates the chart automatically** - It appears on your worksheet

5. **Use chart tools** to customize:
   - Click the chart to reveal Chart Tools with Design and Format tabs
   - Change colors, styles, and layouts
   - Add titles, labels, and legends
   - Adjust axes and data series

**Chart Types and When to Use Them:**

**Column/Bar Charts:**
- Best for: Comparing values across categories
- Example: Sales by month, test scores by student
- Use when you have categories (months, products) and values (sales, scores)

**Line Charts:**
- Best for: Showing trends over time
- Example: Monthly sales trends, temperature changes
- Perfect for data that changes over time periods

**Pie Charts:**
- Best for: Showing parts of a whole
- Example: Budget breakdown, market share
- Use when you want to show percentages or proportions
- Limit to 5-7 categories for clarity

**Area Charts:**
- Best for: Showing cumulative values over time
- Example: Total sales over months, cumulative growth
- Similar to line charts but with filled areas

**Scatter Plots:**
- Best for: Finding relationships between two variables
- Example: Height vs. weight, study time vs. test scores
- Helps identify correlations in data

**Customizing Your Chart:**

**Chart Elements:**
- **Chart Title:** Click "Chart Title" to edit - make it descriptive
- **Axis Titles:** Add labels for X and Y axes (Data tab)
- **Legend:** Shows what each color/series represents
- **Data Labels:** Show values directly on the chart
- **Gridlines:** Help read values accurately

**Chart Styles:**
- **Quick Layout:** Pre-designed layouts that arrange elements nicely
- **Color Schemes:** Choose from built-in color palettes
- **Chart Styles:** Apply different visual styles with one click

**Formatting Options:**
- **Change Colors:** Right-click chart elements to change colors
- **Font Size:** Format text for better readability
- **Add Effects:** Shadows, glows, and 3D effects (use sparingly!)

**Working with Chart Data:**

**Change Data Range:**
- Click the chart
- Go to Chart Design tab → Select Data
- Modify the data range or add/remove series

**Switch Row/Column:**
- Chart Design tab → Switch Row/Column
- This changes what appears on the X and Y axes

**Update Automatically:**
- Charts update automatically when you change the source data
- If you add new data, drag the chart's data range to include it

**Moving and Resizing:**

- **Move Chart:** Click and drag the chart to a new location
- **Resize:** Click chart and drag the corner handles
- **Move to New Sheet:** Chart Design tab → Move Chart

**Pro Tips:**

1. **Choose the Right Chart:** The chart type should match your data and goal. Excel's "Recommended Charts" can help you choose.

2. **Keep It Simple:** Don't overcrowd your chart. Too many data series or categories can make it confusing.

3. **Use Color Meaningfully:** Use colors consistently and meaningfully (e.g., green for positive, red for negative).

4. **Clear Labels:** Always label axes and include a descriptive title. Your audience should understand the chart without reading the data.

5. **Update Regularly:** If your data changes often, charts automatically reflect those changes.

**Common Chart Mistakes to Avoid:**

- Using pie charts for too many categories (becomes hard to read)
- Not labeling axes or including units
- Using 3D charts unnecessarily (they can distort data)
- Choosing colors that are hard to distinguish
- Overcrowding the chart with too much information

The best way to learn charting is to practice! Try creating different chart types with the same data to see which one tells your story best.`,
      order_index: 11
    },
    {
      title: 'Saving & Opening Files',
      content: `Proper file management is crucial! Knowing how to save and open files correctly will prevent you from losing hours of work and help you stay organized.

**Saving Your Work:**

**Quick Save:**

![Save Button Location](images/save-button.png)

- Press **Ctrl+S** (or Cmd+S on Mac) - This is the fastest way!
- Or click the Save icon (floppy disk) in the Quick Access Toolbar
- If the file is already saved, this updates it instantly
- **Best Practice:** Save every few minutes while working

**Saving for the First Time:**
1. Press **Ctrl+S** or click **File → Save**
2. Navigate to where you want to save (Desktop, Documents folder, etc.)
3. Type a descriptive filename
   - Use clear names like "Monthly_Budget_2024" instead of "Excel1"
   - Avoid special characters: / \\ : * ? " < > |
4. Excel files use the .xlsx extension automatically
5. Click **Save**

**Save As (Creating a Copy):**
- **File → Save As** (or press **F12**)
- Use this when you want to:
  - Save with a different name
  - Save to a different location
  - Create a backup copy
  - Save in a different format (like .xls or .csv)

**AutoSave Feature:**
- Excel automatically saves your work periodically (every few minutes)
- If Excel closes unexpectedly, you can recover unsaved work
- Check **File → Info → Manage Workbook → Recover Unsaved Workbooks**

**File Formats:**

**.xlsx** - Modern Excel format (Excel 2007 and later)
- Best for most uses
- Supports all Excel features
- Smaller file size than .xls

**.xls** - Older Excel format (Excel 97-2003)
- Use if you need compatibility with very old Excel versions
- Note: Some newer features may not work

**.csv** - Comma-Separated Values
- Plain text format
- Opens in any spreadsheet program
- Useful for sharing data, but loses formatting and formulas

**.pdf** - Portable Document Format
- Save as PDF when you want to share a read-only version
- Preserves appearance but not editable

**Opening Files:**

**From Recent Files:**
- **File → Open** → **Recent** shows your recently opened files
- Quick access to files you work with often
- Pin frequently used files by clicking the pin icon

**From Computer:**
1. Click **File → Open** (or press **Ctrl+O**)
2. Browse to find your file
3. Double-click the file or select it and click **Open**

**Opening from File Explorer:**
- Navigate to your file in Windows File Explorer
- Double-click the .xlsx file
- Excel opens automatically with your file

**Opening Multiple Files:**
- You can have multiple Excel files open at once
- Switch between them using the taskbar or Alt+Tab
- Each file appears in its own window

**File Organization Tips:**

1. **Create Folders:** Organize related files into folders (e.g., "2024 Budgets", "Work Projects")

2. **Use Descriptive Names:** 
   - Good: "Q1_Sales_Report_2024.xlsx"
   - Bad: "report.xlsx" or "file1.xlsx"

3. **Date Your Files:** Include dates in filenames for versions:
   - "Budget_2024-01-15.xlsx"
   - "Report_v2_2024-01-20.xlsx"

4. **Version Control:** When making major changes, save a copy first:
   - "Budget_Original.xlsx"
   - "Budget_Updated.xlsx"

5. **Backup Regularly:** 
   - Save important files to cloud storage (OneDrive, Google Drive)
   - Or keep a copy on an external drive
   - Don't rely on just one location!

**Keyboard Shortcuts:**

- **Ctrl+S:** Save
- **Ctrl+O:** Open
- **Ctrl+N:** New workbook
- **Ctrl+W:** Close current workbook
- **Ctrl+F4:** Close Excel window
- **F12:** Save As dialog

**Troubleshooting:**

**File Won't Open:**
- Check if file is corrupted
- Try opening in "Safe Mode" (hold Ctrl while opening Excel)
- Try "Open and Repair" option (File → Open → select file → arrow next to Open → Open and Repair)

**Can't Save:**
- Check if file is read-only (right-click file → Properties → uncheck Read-only)
- Ensure you have permission to save in that location
- Check available disk space

**Recovery Options:**
- Excel auto-saves recovery files
- Check File → Info → Manage Workbook for recovered versions
- Always save manually even with auto-save enabled

**Best Practices:**

1. **Save Early, Save Often:** Don't wait until you're done - save constantly!

2. **Use Cloud Storage:** Save to OneDrive or Google Drive for automatic backup

3. **Create Backups:** For critical files, keep multiple copies in different locations

4. **Close Properly:** Always close Excel properly (File → Exit) rather than just closing the window

5. **Organize Your Files:** Set up a folder structure that makes sense for your workflow

Remember: It takes seconds to save, but hours to recreate lost work. Make saving a habit!`,
      order_index: 12
    }
  ];

  // Check if lessons already exist
  db.get('SELECT COUNT(*) as count FROM lessons', (err, row) => {
    if (err) {
      console.error('Error checking lessons:', err);
      // If table doesn't exist yet, wait a bit and try again
      setTimeout(() => insertDefaultLessons(), 500);
      return;
    }
    
    if (row && row.count === 0) {
      // Insert new lessons
      const stmt = db.prepare('INSERT INTO lessons (title, content, order_index) VALUES (?, ?, ?)');
      lessons.forEach((lesson, index) => {
        stmt.run(lesson.title, lesson.content, lesson.order_index, (err) => {
          if (err) {
            console.error(`Error inserting lesson ${index + 1}:`, err);
          }
        });
      });
      stmt.finalize((err) => {
        if (err) {
          console.error('Error finalizing lesson insert:', err);
        } else {
          console.log(`✅ Default lessons inserted (${lessons.length} lessons)`);
        }
      });
    } else if (row) {
      // Update existing lessons and insert new ones
      console.log(`📝 Updating existing lessons with latest content (${row.count} lessons found)...`);
      
      const updateStmt = db.prepare('UPDATE lessons SET title = ?, content = ? WHERE order_index = ?');
      const insertStmt = db.prepare('INSERT INTO lessons (title, content, order_index) VALUES (?, ?, ?)');
      let processCount = 0;
      const totalLessons = lessons.length;
      
      lessons.forEach((lesson) => {
        // Check if lesson with this order_index exists
        db.get('SELECT id FROM lessons WHERE order_index = ?', [lesson.order_index], (err, existingLesson) => {
          if (err) {
            console.error(`Error checking lesson order_index ${lesson.order_index}:`, err);
            processCount++;
            if (processCount === totalLessons) {
              updateStmt.finalize();
              insertStmt.finalize();
            }
          } else if (existingLesson) {
            // Update existing lesson
            updateStmt.run(lesson.title, lesson.content, lesson.order_index, (err) => {
              if (err) {
                console.error(`Error updating lesson order_index ${lesson.order_index}:`, err);
              }
              processCount++;
              if (processCount === totalLessons) {
                console.log(`✅ All lessons processed (updated existing and inserted new)`);
                updateStmt.finalize();
                insertStmt.finalize();
              }
            });
          } else {
            // Insert new lesson
            insertStmt.run(lesson.title, lesson.content, lesson.order_index, (err) => {
              if (err) {
                console.error(`Error inserting lesson order_index ${lesson.order_index}:`, err);
              }
              processCount++;
              if (processCount === totalLessons) {
                console.log(`✅ All lessons processed (updated existing and inserted new)`);
                updateStmt.finalize();
                insertStmt.finalize();
              }
            });
          }
        });
      });
    }
  });
}

/**
 * Insert default quiz questions
 * Each lesson now has 5+ questions for comprehensive testing
 */
function insertDefaultQuizQuestions() {
  const questions = [
    // Lesson 1: What is Excel? (5 questions)
    { lesson_id: 1, question: 'What is Excel primarily used for?', option_a: 'Playing games', option_b: 'Organizing and analyzing data', option_c: 'Sending emails', option_d: 'Browsing the internet', correct_answer: 'B', explanation: 'Excel is a spreadsheet program designed to organize, calculate, and analyze data.' },
    { lesson_id: 1, question: 'What can you do with Excel?', option_a: 'Only type text', option_b: 'Organize data, perform calculations, and create charts', option_c: 'Only create charts', option_d: 'Only save files', correct_answer: 'B', explanation: 'Excel can do many things including organizing data, performing calculations, creating charts, and more.' },
    { lesson_id: 1, question: 'Which of these is NOT a common use of Excel?', option_a: 'Budget tracking', option_b: 'Sales reports', option_c: 'Video editing', option_d: 'Grade books', correct_answer: 'C', explanation: 'Video editing requires specialized software. Excel is used for data tasks like budgets, reports, and grade books.' },
    { lesson_id: 1, question: 'What is a spreadsheet made up of?', option_a: 'Pages and chapters', option_b: 'Rows and columns forming a grid', option_c: 'Slides and transitions', option_d: 'Paragraphs and sentences', correct_answer: 'B', explanation: 'A spreadsheet is a grid made up of rows (horizontal) and columns (vertical).' },
    { lesson_id: 1, question: 'Why is learning Excel valuable?', option_a: 'It is only useful for accountants', option_b: 'Excel skills are useful in almost any job or personal project', option_c: 'It is required by law', option_d: 'It replaces all other software', correct_answer: 'B', explanation: 'Excel is one of the most widely used tools across industries and personal projects.' },
    
    // Lesson 2: How To Navigate in Excel (5 questions)
    { lesson_id: 2, question: 'What keyboard shortcut takes you to cell A1?', option_a: 'Ctrl + A', option_b: 'Ctrl + Home', option_c: 'Home', option_d: 'Ctrl + End', correct_answer: 'B', explanation: 'Press Ctrl + Home to jump to cell A1 (the top-left corner of your spreadsheet).' },
    { lesson_id: 2, question: 'How do you jump to a specific cell address quickly?', option_a: 'Type it in the Name Box', option_b: 'Scroll to it', option_c: 'Double-click the cell', option_d: 'Press Ctrl + F', correct_answer: 'A', explanation: 'You can type a cell address in the Name Box (top-left) and press Enter to jump directly to that cell.' },
    { lesson_id: 2, question: 'What does pressing Tab do in Excel?', option_a: 'Deletes the cell', option_b: 'Moves one cell to the right', option_c: 'Opens a new tab', option_d: 'Saves the file', correct_answer: 'B', explanation: 'Pressing Tab moves the cursor one cell to the right.' },
    { lesson_id: 2, question: 'How do you select an entire row?', option_a: 'Press Ctrl + A', option_b: 'Click the row number on the left', option_c: 'Double-click a cell', option_d: 'Press Delete', correct_answer: 'B', explanation: 'Click the row number on the left side to select the entire row.' },
    { lesson_id: 2, question: 'What does Ctrl + End do?', option_a: 'Goes to cell A1', option_b: 'Closes Excel', option_c: 'Jumps to the last cell with data', option_d: 'Selects all cells', correct_answer: 'C', explanation: 'Ctrl + End jumps to the last cell in the worksheet that contains data.' },
    
    // Lesson 3: Excel Interface (5 questions)
    { lesson_id: 3, question: 'What is a cell?', option_a: 'A row of data', option_b: 'A small box where you type data', option_c: 'A column label', option_d: 'A toolbar button', correct_answer: 'B', explanation: 'A cell is a small box where you can type data. Each cell has an address like A1 or B2.' },
    { lesson_id: 3, question: 'What is the Ribbon?', option_a: 'A type of cell', option_b: 'The toolbar at the top with buttons', option_c: 'A formula', option_d: 'A chart type', correct_answer: 'B', explanation: 'The Ribbon is the toolbar at the top of Excel that contains buttons for formatting, formulas, charts, and more.' },
    { lesson_id: 3, question: 'What does the Formula Bar show?', option_a: 'The file name', option_b: 'The contents of the selected cell', option_c: 'The date and time', option_d: 'A list of formulas', correct_answer: 'B', explanation: 'The Formula Bar shows what is actually inside the selected cell, including formulas.' },
    { lesson_id: 3, question: 'What is the address of the cell in column B, row 3?', option_a: '3B', option_b: 'B3', option_c: 'Row3Col2', option_d: '2,3', correct_answer: 'B', explanation: 'Cell addresses use the column letter followed by the row number, so column B row 3 = B3.' },
    { lesson_id: 3, question: 'Where are the Sheet Tabs located?', option_a: 'At the top of the screen', option_b: 'In the Ribbon', option_c: 'At the bottom of the screen', option_d: 'In the Formula Bar', correct_answer: 'C', explanation: 'Sheet Tabs are found at the bottom of the Excel window, allowing you to switch between different sheets.' },
    
    // Lesson 4: Entering Data (5 questions)
    { lesson_id: 4, question: 'How do you enter data into a cell?', option_a: 'Right-click the cell', option_b: 'Click the cell, type, then press Enter', option_c: 'Double-click the ribbon', option_d: 'Press Ctrl+S', correct_answer: 'B', explanation: 'To enter data, click a cell, type your information, and press Enter.' },
    { lesson_id: 4, question: 'What happens when you press Tab after entering data?', option_a: 'Data is deleted', option_b: 'Data is saved and cursor moves right', option_c: 'A new row is created', option_d: 'Excel closes', correct_answer: 'B', explanation: 'Tab saves your data and moves the cursor to the next column (right).' },
    { lesson_id: 4, question: 'How do you edit data already in a cell?', option_a: 'Delete the sheet and start over', option_b: 'Double-click the cell or press F2', option_c: 'Right-click and select "Undo"', option_d: 'Press Ctrl+Z to clear', correct_answer: 'B', explanation: 'Double-click a cell to edit it in place, or select it and press F2.' },
    { lesson_id: 4, question: 'What does AutoFill do?', option_a: 'Automatically saves your file', option_b: 'Fills adjacent cells by continuing a pattern', option_c: 'Formats all cells at once', option_d: 'Adds borders automatically', correct_answer: 'B', explanation: 'AutoFill lets you drag the fill handle to continue patterns like numbers (1,2,3...) or dates.' },
    { lesson_id: 4, question: 'What shortcut undoes your last action?', option_a: 'Ctrl+Z', option_b: 'Ctrl+Y', option_c: 'Ctrl+X', option_d: 'Ctrl+U', correct_answer: 'A', explanation: 'Ctrl+Z is the universal undo shortcut. It works in Excel and most other programs.' },
    
    // Lesson 5: Formatting (5 questions)
    { lesson_id: 5, question: 'How do you make text bold?', option_a: 'Press Ctrl+B', option_b: 'Click the B button in the ribbon', option_c: 'Type "bold" before the text', option_d: 'Both A and B', correct_answer: 'D', explanation: 'You can make text bold by pressing Ctrl+B or clicking the B button in the ribbon.' },
    { lesson_id: 5, question: 'What does the Format Painter do?', option_a: 'Paints a picture in a cell', option_b: 'Copies formatting from one cell to another', option_c: 'Changes the font color', option_d: 'Adds a border', correct_answer: 'B', explanation: 'Format Painter copies the formatting style from one cell and applies it to another.' },
    { lesson_id: 5, question: 'Which shortcut opens the Format Cells dialog?', option_a: 'Ctrl+B', option_b: 'Ctrl+1', option_c: 'Ctrl+F', option_d: 'F12', correct_answer: 'B', explanation: 'Ctrl+1 opens the Format Cells dialog box with advanced formatting options.' },
    { lesson_id: 5, question: 'What is a good practice for formatting headers?', option_a: 'Use the smallest font possible', option_b: 'Make them bold and use a different background color', option_c: 'Leave them identical to data', option_d: 'Delete them to save space', correct_answer: 'B', explanation: 'Headers should stand out from data - bold text and a colored background help distinguish them.' },
    { lesson_id: 5, question: 'How do you display numbers as currency?', option_a: 'Type a dollar sign manually', option_b: 'Select cells and click the $ icon or format as Currency', option_c: 'It happens automatically', option_d: 'Use the Ctrl+M shortcut', correct_answer: 'B', explanation: 'Select cells and use the Currency format button ($) to properly format numbers as money.' },
    
    // Lesson 6: Simple Formulas (5 questions)
    { lesson_id: 6, question: 'What symbol must all formulas start with?', option_a: '+', option_b: '=', option_c: '-', option_d: '*', correct_answer: 'B', explanation: 'All Excel formulas must start with an equals sign (=).' },
    { lesson_id: 6, question: 'What does =MAX(A1:A5) do?', option_a: 'Finds the smallest number', option_b: 'Adds all numbers', option_c: 'Finds the largest number', option_d: 'Counts cells', correct_answer: 'C', explanation: 'The MAX function finds the largest number in the specified range.' },
    { lesson_id: 6, question: 'What does =MIN(B1:B10) return?', option_a: 'The total of all values', option_b: 'The average of all values', option_c: 'The smallest number in the range', option_d: 'The number of cells', correct_answer: 'C', explanation: 'MIN returns the smallest (minimum) number in the specified range.' },
    { lesson_id: 6, question: 'What error appears when you try to do math with text?', option_a: '#DIV/0!', option_b: '#VALUE!', option_c: '#REF!', option_d: '#NAME?', correct_answer: 'B', explanation: '#VALUE! error appears when Excel tries to perform math on text or incompatible data types.' },
    { lesson_id: 6, question: 'What does =COUNT(A1:A10) do?', option_a: 'Adds all numbers', option_b: 'Counts cells that contain numbers', option_c: 'Counts all cells including empty ones', option_d: 'Finds the maximum value', correct_answer: 'B', explanation: 'COUNT counts only cells that contain numeric values in the specified range.' },
    
    // Lesson 7: Basic Math Formulas - SUM (5 questions)
    { lesson_id: 7, question: 'What does =SUM(A1:A5) do?', option_a: 'Finds the average', option_b: 'Adds all numbers from A1 to A5', option_c: 'Finds the maximum', option_d: 'Counts cells', correct_answer: 'B', explanation: 'The SUM function adds all numbers in the specified range.' },
    { lesson_id: 7, question: 'What is the keyboard shortcut for AutoSum?', option_a: 'Ctrl + S', option_b: 'Alt + =', option_c: 'Shift + S', option_d: 'Ctrl + =', correct_answer: 'B', explanation: 'Press Alt + = to quickly insert the AutoSum function.' },
    { lesson_id: 7, question: 'Which is better: =A1+A2+A3+A4 or =SUM(A1:A4)?', option_a: 'They are exactly the same, no difference', option_b: '=SUM(A1:A4) is better - easier to read and modify', option_c: '=A1+A2+A3+A4 is always better', option_d: 'Neither works in Excel', correct_answer: 'B', explanation: 'SUM is preferred because it is easier to read, modify, and works better with large ranges.' },
    { lesson_id: 7, question: 'Can you add multiple separate ranges with SUM?', option_a: 'No, only one range at a time', option_b: 'Yes, separate ranges with commas like =SUM(A1:A5,C1:C5)', option_c: 'Only with a special add-in', option_d: 'Only in newer versions of Excel', correct_answer: 'B', explanation: 'You can add multiple ranges by separating them with commas: =SUM(A1:A5,C1:C5).' },
    { lesson_id: 7, question: 'What happens to a SUM when you change a value in the range?', option_a: 'Nothing, you must recalculate manually', option_b: 'The SUM updates automatically', option_c: 'The formula breaks', option_d: 'You need to delete and rewrite it', correct_answer: 'B', explanation: 'Excel formulas update automatically when the source data changes - that is the magic of formulas!' },
    
    // Lesson 8: How to Write Formulas (5 questions)
    { lesson_id: 8, question: 'In the formula =A1+B1*C1, which operation happens first?', option_a: 'Addition', option_b: 'Multiplication', option_c: 'They happen at the same time', option_d: 'Subtraction', correct_answer: 'B', explanation: 'Multiplication happens before addition (PEMDAS), so it calculates B1*C1 first, then adds A1.' },
    { lesson_id: 8, question: 'What does $A$1 mean in a formula?', option_a: 'An absolute reference that won\'t change when copied', option_b: 'A relative reference that changes when copied', option_c: 'A formula error', option_d: 'A text value', correct_answer: 'A', explanation: 'The $ signs create an absolute reference that stays fixed when you copy the formula to other cells.' },
    { lesson_id: 8, question: 'What does =(2+3)*4 equal?', option_a: '14', option_b: '20', option_c: '24', option_d: '9', correct_answer: 'B', explanation: 'Parentheses first: (2+3)=5, then 5*4=20.' },
    { lesson_id: 8, question: 'How do you add 15% to a value in cell A1?', option_a: '=A1+15', option_b: '=A1*1.15', option_c: '=A1/15', option_d: '=A1-0.15', correct_answer: 'B', explanation: 'Multiplying by 1.15 adds 15% to the original value (1 + 0.15 = 1.15).' },
    { lesson_id: 8, question: 'What is the best way to build complex formulas?', option_a: 'Write the entire formula at once', option_b: 'Start simple and build step by step, testing as you go', option_c: 'Copy formulas from the internet', option_d: 'Use only basic addition', correct_answer: 'B', explanation: 'Building formulas step by step helps avoid errors and makes debugging easier.' },
    
    // Lesson 9: Pivot Tables (5 questions)
    { lesson_id: 9, question: 'What is a Pivot Table primarily used for?', option_a: 'Formatting cells', option_b: 'Summarizing and analyzing large amounts of data', option_c: 'Creating charts', option_d: 'Saving files', correct_answer: 'B', explanation: 'Pivot Tables are powerful tools for quickly summarizing, analyzing, and exploring data from different angles.' },
    { lesson_id: 9, question: 'Where do you find the option to create a Pivot Table?', option_a: 'Home tab', option_b: 'Insert tab', option_c: 'View tab', option_d: 'File menu', correct_answer: 'B', explanation: 'Pivot Tables are created from the Insert tab in the ribbon.' },
    { lesson_id: 9, question: 'What should your data have in the first row for a Pivot Table?', option_a: 'Numbers only', option_b: 'Column headers describing each column', option_c: 'Blank cells', option_d: 'Formulas', correct_answer: 'B', explanation: 'Your first row must contain descriptive column headers for the Pivot Table to work properly.' },
    { lesson_id: 9, question: 'What does the Values area in a Pivot Table do?', option_a: 'Filters the data', option_b: 'Creates row labels', option_c: 'Performs calculations like SUM, COUNT, or AVERAGE', option_d: 'Adds column headers', correct_answer: 'C', explanation: 'The Values area is where you place fields you want to calculate (sum, count, average, etc.).' },
    { lesson_id: 9, question: 'How do you update a Pivot Table after changing source data?', option_a: 'Delete and recreate it', option_b: 'Click Refresh in the PivotTable Analyze tab', option_c: 'It updates automatically always', option_d: 'Press Ctrl+Z', correct_answer: 'B', explanation: 'Click Refresh (or right-click > Refresh) to update the Pivot Table with new data.' },
    
    // Lesson 10: Sorting & Filtering (5 questions)
    { lesson_id: 10, question: 'What does sorting do?', option_a: 'Deletes data', option_b: 'Organizes data in a specific order', option_c: 'Formats cells', option_d: 'Creates charts', correct_answer: 'B', explanation: 'Sorting organizes your data in a specific order (like A-Z or smallest to largest).' },
    { lesson_id: 10, question: 'Does filtering delete data?', option_a: 'Yes, filtered rows are permanently removed', option_b: 'No, it only temporarily hides rows', option_c: 'It moves data to another sheet', option_d: 'It converts data to text', correct_answer: 'B', explanation: 'Filtering only hides rows that don\'t match your criteria. Your data is safe and can be shown again.' },
    { lesson_id: 10, question: 'Can you sort by multiple columns at once?', option_a: 'No, only one column', option_b: 'Yes, using multi-level sort', option_c: 'Only with formulas', option_d: 'Only in the newest Excel version', correct_answer: 'B', explanation: 'Multi-level sort lets you sort by a primary column, then by secondary columns within that.' },
    { lesson_id: 10, question: 'What does the * wildcard match in a text filter?', option_a: 'Only one character', option_b: 'Any number of characters', option_c: 'Only numbers', option_d: 'Nothing - it is not valid', correct_answer: 'B', explanation: 'The asterisk (*) wildcard matches any number of characters. "Smith*" finds Smith, Smithson, etc.' },
    { lesson_id: 10, question: 'What happens when you copy filtered data?', option_a: 'All rows including hidden ones are copied', option_b: 'Only visible (filtered) rows are copied', option_c: 'Nothing is copied', option_d: 'The filter is removed', correct_answer: 'B', explanation: 'When copying filtered data, only the visible rows are included in the copy.' },
    
    // Lesson 11: Charts (5 questions)
    { lesson_id: 11, question: 'Where do you find the option to create charts?', option_a: 'In the File menu', option_b: 'In the Insert tab', option_c: 'In cell A1', option_d: 'In the formula bar', correct_answer: 'B', explanation: 'Charts are created from the Insert tab in the ribbon.' },
    { lesson_id: 11, question: 'Which chart is best for showing trends over time?', option_a: 'Pie Chart', option_b: 'Line Chart', option_c: 'Bar Chart', option_d: 'Scatter Plot', correct_answer: 'B', explanation: 'Line charts are ideal for showing how values change over time periods.' },
    { lesson_id: 11, question: 'Which chart is best for showing parts of a whole?', option_a: 'Line Chart', option_b: 'Scatter Plot', option_c: 'Pie Chart', option_d: 'Area Chart', correct_answer: 'C', explanation: 'Pie charts show proportions/percentages of a whole, like a budget breakdown.' },
    { lesson_id: 11, question: 'What should every chart have?', option_a: 'A 3D effect', option_b: 'A clear title and labeled axes', option_c: 'At least 10 data series', option_d: 'Bright neon colors', correct_answer: 'B', explanation: 'Every chart should have a descriptive title and clearly labeled axes so viewers understand the data.' },
    { lesson_id: 11, question: 'Do charts update when source data changes?', option_a: 'No, you must recreate them', option_b: 'Yes, charts automatically reflect data changes', option_c: 'Only if you press F5', option_d: 'Only for pie charts', correct_answer: 'B', explanation: 'Charts in Excel automatically update when you modify the underlying source data.' },
    
    // Lesson 12: Saving & Opening (5 questions)
    { lesson_id: 12, question: 'What keyboard shortcut saves a file?', option_a: 'Ctrl+C', option_b: 'Ctrl+V', option_c: 'Ctrl+S', option_d: 'Ctrl+X', correct_answer: 'C', explanation: 'Press Ctrl+S (or Cmd+S on Mac) to save your file quickly.' },
    { lesson_id: 12, question: 'What is the modern Excel file format?', option_a: '.doc', option_b: '.xlsx', option_c: '.pdf', option_d: '.txt', correct_answer: 'B', explanation: '.xlsx is the modern Excel format (2007 and later) that supports all features.' },
    { lesson_id: 12, question: 'When should you use Save As instead of Save?', option_a: 'Every time you save', option_b: 'When you want to save with a different name or location', option_c: 'Never - always use Save', option_d: 'Only for new files', correct_answer: 'B', explanation: 'Save As lets you save a copy with a different name, location, or format.' },
    { lesson_id: 12, question: 'What format loses formulas and formatting but works everywhere?', option_a: '.xlsx', option_b: '.xls', option_c: '.csv', option_d: '.xlsm', correct_answer: 'C', explanation: 'CSV (Comma-Separated Values) is plain text that works in any program but loses formatting and formulas.' },
    { lesson_id: 12, question: 'What is the BEST habit for file safety?', option_a: 'Save once when finished', option_b: 'Save frequently and keep backups', option_c: 'Never save - rely on auto-recovery', option_d: 'Only save to USB drives', correct_answer: 'B', explanation: 'Save early and often! Keep backups in multiple locations (cloud + local) for important files.' }
  ];

  db.get('SELECT COUNT(*) as count FROM quiz_questions', (err, row) => {
    if (err) {
      console.error('Error checking quiz questions:', err);
      // If table doesn't exist yet, wait a bit and try again
      setTimeout(() => insertDefaultQuizQuestions(), 500);
      return;
    }
    
    if (row && row.count === 0) {
      const stmt = db.prepare(`
        INSERT INTO quiz_questions 
        (lesson_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      questions.forEach((q, index) => {
        stmt.run(q.lesson_id, q.question, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_answer, q.explanation, (err) => {
          if (err) {
            console.error(`Error inserting question ${index + 1}:`, err);
          }
        });
      });
      stmt.finalize((err) => {
        if (err) {
          console.error('Error finalizing quiz question insert:', err);
        } else {
          console.log(`✅ Default quiz questions inserted (${questions.length} questions)`);
        }
      });
    } else if (row && row.count < questions.length) {
      // More questions available than in DB - clear and re-insert
      console.log(`📝 Updating quiz questions (${row.count} -> ${questions.length})...`);
      db.run('DELETE FROM quiz_questions', (err) => {
        if (err) {
          console.error('Error clearing quiz questions:', err);
          return;
        }
        const stmt = db.prepare(`
          INSERT INTO quiz_questions 
          (lesson_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        questions.forEach((q, index) => {
          stmt.run(q.lesson_id, q.question, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_answer, q.explanation, (err) => {
            if (err) {
              console.error(`Error inserting question ${index + 1}:`, err);
            }
          });
        });
        stmt.finalize((err) => {
          if (err) {
            console.error('Error finalizing quiz question insert:', err);
          } else {
            console.log(`✅ Quiz questions updated (${questions.length} questions)`);
          }
        });
      });
    } else if (row) {
      console.log(`✅ Quiz questions already exist (${row.count} questions)`);
    }
  });
}

// Export database connection
module.exports = db;

