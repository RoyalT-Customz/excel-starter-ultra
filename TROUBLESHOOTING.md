# ExcelStarter Ultra - Troubleshooting Guide

## Quick Fix Steps

### Step 1: Run Diagnostic Tool
First, run the diagnostic tool to identify issues:
```
DIAGNOSE.bat
```

This will check:
- ✅ Node.js installation
- ✅ npm installation  
- ✅ Required dependencies
- ✅ Port availability
- ✅ Required files

### Step 2: Common Issues & Solutions

#### Issue 1: Node.js Not Installed
**Symptoms:** Error message saying "Node.js is not installed"

**Solution:**
1. Download Node.js from https://nodejs.org/
2. Install the **LTS version** (Long Term Support)
3. Restart your computer after installation
4. Try running `START_APP.bat` again

#### Issue 2: Dependencies Missing
**Symptoms:** Error messages about missing packages or modules

**Solution:**
Open Command Prompt in this folder and run:
```batch
npm install
cd server
npm install
cd ..
cd client
npm install
cd ..
```

Then try `START_APP.bat` again.

#### Issue 3: Port Already in Use
**Symptoms:** Server won't start, error about port 3000 or 5000 being in use

**Solution:**
1. Close all instances of the app
2. Close other applications that might use ports 3000 or 5000
3. Or restart your computer
4. Try `START_APP.bat` again

#### Issue 4: Browser Opens but Page Won't Load
**Symptoms:** Browser opens but shows "This site can't be reached" or keeps loading

**Solution:**
1. Wait 30-60 seconds for the React app to compile (first time takes longer)
2. Check the "ExcelStarter Ultra - Server" window for any error messages
3. Look for "Compiled successfully" message in that window
4. Refresh your browser
5. If still not working, manually go to: http://localhost:3000

#### Issue 5: Firewall Blocking Access
**Symptoms:** Server starts but browser can't connect

**Solution:**
1. Windows Firewall may be blocking the connection
2. When prompted, allow Node.js through the firewall
3. Or manually add Node.js to Windows Firewall exceptions

#### Issue 6: Powershell Execution Policy (If using PowerShell)
**Symptoms:** Script won't run in PowerShell

**Solution:**
Run in Command Prompt (cmd.exe) instead of PowerShell, or run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Manual Start (If BAT file doesn't work)

If `START_APP.bat` doesn't work, you can start manually:

1. Open Command Prompt in this folder
2. Make sure dependencies are installed (see Issue 2 above)
3. Run: `npm run dev`
4. Wait for compilation to finish
5. Open your browser to: http://localhost:3000

## Still Not Working?

If none of these solutions work:

1. Make sure you're running as Administrator (right-click → Run as Administrator)
2. Check if antivirus is blocking Node.js
3. Try disabling antivirus temporarily
4. Make sure you have enough disk space
5. Check Windows Event Viewer for errors

## Need More Help?

Check the application window for specific error messages and share them for troubleshooting.

