/**
 * Electron Main Process
 * This is the entry point for the Electron desktop application
 */

// Redirect console output to stdout/stderr AND a log file
// This is important for debugging packaged apps
const fs = require('fs');
const path = require('path');
const os = require('os');

// Create log file in user's temp directory
const logPath = path.join(os.tmpdir(), 'excelstarter-ultra.log');
const logStream = fs.createWriteStream(logPath, { flags: 'a' });

function writeLog(level, ...args) {
  const timestamp = new Date().toISOString();
  const message = args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ');
  const logLine = `[${timestamp}] [${level}] ${message}\n`;
  
  // Write to file
  logStream.write(logLine);
  
  // Also write to stdout/stderr if available
  if (process.stdout && process.stdout.write) {
    try {
      process.stdout.write(logLine);
    } catch (e) {
      // Ignore if stdout is not available
    }
  }
}

const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

console.log = (...args) => {
  originalLog(...args);
  writeLog('LOG', ...args);
};

console.error = (...args) => {
  originalError(...args);
  writeLog('ERROR', ...args);
  if (process.stderr && process.stderr.write) {
    try {
      process.stderr.write('[ERROR] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n');
    } catch (e) {}
  }
};

console.warn = (...args) => {
  originalWarn(...args);
  writeLog('WARN', ...args);
};

console.log('=== ExcelStarter Ultra Starting ===');
console.log('Log file location:', logPath);

// Catch errors as early as possible - BEFORE requiring electron
process.on('uncaughtException', (error) => {
  console.error('CRITICAL ERROR:', error);
  console.error('Stack:', error.stack);
  
  // Try to show error dialog
  try {
    const { app, dialog, BrowserWindow } = require('electron');
    
    // Create a simple error window
    if (app) {
      app.whenReady().then(() => {
        const errorWindow = new BrowserWindow({
          width: 800,
          height: 600,
          show: true
        });
        
        errorWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body {
                padding: 20px;
                font-family: Arial;
                background: #FFF5F5;
              }
              h1 { color: #FF0000; }
              pre {
                background: #f0f0f0;
                padding: 10px;
                overflow: auto;
                text-align: left;
                white-space: pre-wrap;
              }
            </style>
          </head>
          <body>
            <h1>Application Error</h1>
            <p><strong>Error:</strong> ${error.message}</p>
            <h3>Stack Trace:</h3>
            <pre>${error.stack}</pre>
          </body>
          </html>
        `));
        
        dialog.showErrorBox('Critical Error', `Application crashed: ${error.message}`);
      });
    }
  } catch (e) {
    // If we can't show dialog, at least log it
    console.error('Could not show error dialog:', e);
  }
  
  // Keep process alive for a bit to show error
  setTimeout(() => {
    process.exit(1);
  }, 5000);
});

// Now require electron
// Note: path, fs, and os are already required above for logging
const { app, BrowserWindow, Menu } = require('electron');
const { spawn } = require('child_process');

// Check if we're in development mode
// In production, electron-is-dev might not be available, so we check the environment
let isDev = false;
try {
  // Try to require electron-is-dev, but don't fail if it's not available
  const electronIsDev = require('electron-is-dev');
  isDev = electronIsDev;
  console.log('Using electron-is-dev, isDev:', isDev);
} catch (e) {
  // If electron-is-dev is not available, check environment variables
  // Don't access app.isPackaged here - app might not be ready yet
  isDev = process.env.ELECTRON_IS_DEV === '1' || 
          process.env.NODE_ENV === 'development';
  console.log('electron-is-dev not available, using fallback. isDev:', isDev);
}

let mainWindow;
let serverProcess;
let clientProcess;

// Paths - will be initialized when app is ready (can't access app.isPackaged before app is ready)
let appPath;
let serverPath;
const clientPath = path.join(__dirname, '..', 'client');

function initializePaths() {
  try {
    const isPackaged = app.isPackaged;
    
    appPath = isPackaged 
      ? path.dirname(process.execPath)  // In production, use the app directory
      : path.join(__dirname, '..');     // In development, use project root

    if (isPackaged) {
      // In packaged apps, files are in app.asar
      // Try both with and without app.asar in the path
      const asarPath = path.join(process.resourcesPath, 'app.asar', 'server', 'app.js');
      const regularPath = path.join(process.resourcesPath, 'app', 'server', 'app.js');
      
      // Check which one exists
      const fs = require('fs');
      if (fs.existsSync(asarPath)) {
        serverPath = asarPath;
      } else if (fs.existsSync(regularPath)) {
        serverPath = regularPath;
      } else {
        // Default to asar path (Node.js can require from asar)
        serverPath = asarPath;
      }
    } else {
      serverPath = path.join(__dirname, '..', 'server', 'app.js');  // Dev path
    }

    console.log('Paths initialized:');
    console.log('  App path:', appPath);
    console.log('  Server path:', serverPath);
    console.log('  Is packaged:', isPackaged);
    console.log('  Resources path:', process.resourcesPath);
    console.log('  __dirname:', __dirname);
  } catch (error) {
    console.error('Error initializing paths:', error);
    throw error;
  }
}

function createWindow() {
  try {
    console.log('Creating window...');
    
    // Initialize paths now that app is ready
    initializePaths();
    
    // Set user data path for Electron (where database will be stored)
    const userDataPath = app.getPath('userData');
    process.env.ELECTRON_USER_DATA = userDataPath;
    console.log('User data path:', userDataPath);
    
    // Determine icon path - try multiple locations
    let iconPath;
    if (app.isPackaged) {
      // In packaged app, try multiple possible locations
      const possiblePaths = [
        path.join(process.resourcesPath, 'app', 'electron', 'assets', 'icon.ico'),
        path.join(process.resourcesPath, 'electron', 'assets', 'icon.ico'),
        path.join(appPath, 'electron', 'assets', 'icon.ico'),
        path.join(__dirname, 'assets', 'icon.ico'),
        process.execPath // Use the .exe itself (has embedded icon)
      ];
      
      // Find the first path that exists
      const fs = require('fs');
      for (const testPath of possiblePaths) {
        if (fs.existsSync(testPath)) {
          iconPath = testPath;
          console.log('Using icon path:', iconPath);
          break;
        }
      }
      
      // If no icon file found, use the executable (which has the embedded icon)
      if (!iconPath) {
        iconPath = process.execPath;
        console.log('No icon file found, using executable icon:', iconPath);
      }
    } else {
      // In development, use local icon
      iconPath = path.join(__dirname, 'assets', 'icon.ico');
    }
    
    // Create the browser window
    mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      minWidth: 1000,
      minHeight: 700,
      icon: iconPath,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        webSecurity: true
      },
    backgroundColor: '#FFF5F5', // Baby pink background
    show: true // Show immediately - we'll show loading screen
  });
    
    console.log('Window created successfully');

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    console.log('Window ready to show');
    if (!mainWindow.isVisible()) {
      mainWindow.show();
    }
    mainWindow.focus();
    
    // Focus the window
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });
  
  // Make sure window is visible
  mainWindow.once('show', () => {
    console.log('Window is now visible');
  });
  
  // Handle window errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
    mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 20px;
            background: #FFF5F5;
            font-family: Arial, sans-serif;
            text-align: center;
          }
          h1 { color: #FF0000; }
          pre { text-align: left; background: #f0f0f0; padding: 10px; }
        </style>
      </head>
      <body>
        <h1>Failed to Load Application</h1>
        <p>Error Code: ${errorCode}</p>
        <p>Error: ${errorDescription}</p>
        <p>Please check the console for more details.</p>
      </body>
      </html>
    `));
  });
  
  } catch (error) {
    console.error('Error in createWindow:', error);
    const { dialog } = require('electron');
    dialog.showErrorBox('Window Creation Error', `Failed to create window: ${error.message}\n\n${error.stack}`);
  }

  // Start the backend server
  startServer();

  // Show loading message
  mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: #FFF5F5;
          font-family: Arial, sans-serif;
        }
        .loading {
          text-align: center;
        }
        .spinner {
          border: 4px solid #FFB6C1;
          border-top: 4px solid #FF91A4;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        h1 { color: #FF91A4; }
      </style>
    </head>
    <body>
      <div class="loading">
        <div class="spinner"></div>
        <h1>Starting ExcelStarter Ultra...</h1>
        <p>Please wait while we start the server.</p>
      </div>
    </body>
    </html>
  `));

  // Wait for server to start, then load the client
  let retryCount = 0;
  const maxRetries = 30; // Increased retries - server might take longer to start
  
  function tryLoadApp() {
    // Use 127.0.0.1 instead of localhost to avoid IPv6 issues
    const url = isDev ? 'http://127.0.0.1:3000' : 'http://127.0.0.1:5000';
    
    console.log(`Attempting to connect to server (attempt ${retryCount + 1}/${maxRetries})...`);
    console.log(`Trying URL: ${url}`);
    
    // Check if server is ready by making a test request
    const http = require('http');
    const testReq = http.get(url + '/api/health', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Server is ready, loading app...');
          mainWindow.loadURL(url).catch(err => {
            console.error('Error loading URL:', err);
            if (retryCount < maxRetries) {
              retryCount++;
              setTimeout(tryLoadApp, 2000);
            }
          });
        } else {
          console.log(`Server responded with status ${res.statusCode}, retrying...`);
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(tryLoadApp, 1000);
          }
        }
      });
    });
    
    testReq.on('error', (err) => {
      // Server not ready yet
      console.log(`Server not ready yet (${err.message}), retrying...`);
      if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(tryLoadApp, 1000);
      } else {
        console.error('❌ Server failed to start after', maxRetries, 'retries');
        mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body {
                margin: 0;
                padding: 20px;
                background: #FFF5F5;
                font-family: Arial, sans-serif;
                text-align: center;
              }
              h1 { color: #FF0000; }
              pre {
                background: #f0f0f0;
                padding: 10px;
                text-align: left;
                max-width: 800px;
                margin: 20px auto;
              }
            </style>
          </head>
          <body>
            <h1>Failed to Start Server</h1>
            <p>The application server could not be started after ${maxRetries} attempts.</p>
            <p><strong>Error:</strong> ${err.message}</p>
            <p>Please check the console for more details.</p>
            <p>You can try:</p>
            <ul style="text-align: left; max-width: 600px; margin: 20px auto;">
              <li>Closing and reopening the app</li>
              <li>Checking if port 5000 is already in use</li>
              <li>Running the app as Administrator</li>
            </ul>
          </body>
          </html>
        `));
      }
    });
    
    testReq.setTimeout(2000, () => {
      testReq.destroy();
      if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(tryLoadApp, 1000);
      }
    });
  }
  
  // Start trying to load after a short delay (give server time to start)
  setTimeout(tryLoadApp, 3000);

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
    stopServers();
  });

  // Create application menu
  createMenu();
}

function startServer() {
  // Start Express server directly in the Electron process
  // This avoids needing Node.js in the system PATH
  const isProduction = !isDev;
  
  // Set environment variables
  process.env.PORT = '5000';
  process.env.NODE_ENV = isProduction ? 'production' : 'development';
  process.env.ELECTRON_USER_DATA = app.getPath('userData');
  
  // Change to the correct directory
  const workingDir = app.isPackaged
    ? path.join(process.resourcesPath, 'app')
    : path.join(__dirname, '..');
  
  // Verify server file exists
  const fs = require('fs');
  if (!fs.existsSync(serverPath)) {
    console.error('❌ Server file not found at:', serverPath);
    console.error('Trying alternative paths...');
    
    // Try alternative paths (including asar paths)
    const altPaths = [
      path.join(process.resourcesPath, 'app.asar', 'server', 'app.js'),
      path.join(process.resourcesPath, 'app', 'server', 'app.js'),
      path.join(__dirname, '..', 'server', 'app.js'),
      path.join(__dirname, 'server', 'app.js'),
      path.join(appPath, 'server', 'app.js'),
      // Try relative to current working directory
      path.join(process.cwd(), 'server', 'app.js')
    ];
    
    for (const altPath of altPaths) {
      if (fs.existsSync(altPath)) {
        console.log('Found server at:', altPath);
        serverPath = altPath;
        break;
      }
    }
  }
  
  if (!fs.existsSync(serverPath)) {
    const errorMsg = `Server file not found. Tried: ${serverPath}`;
    console.error('❌', errorMsg);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`
        <!DOCTYPE html>
        <html>
        <head><style>body { padding: 20px; font-family: Arial; }</style></head>
        <body>
          <h1>Server File Not Found</h1>
          <p>Could not find server at: ${serverPath}</p>
          <p>Please check the console for details.</p>
        </body>
        </html>
      `));
    }
    return;
  }
  
  try {
    // Don't change directory - it can break module resolution
    // process.chdir(workingDir);
    console.log('Starting server...');
    console.log('Working dir:', workingDir);
    console.log('Server path:', serverPath);
    console.log('App is packaged:', app.isPackaged);
    console.log('Current directory:', process.cwd());
    
    // For packaged apps, Node.js can require from asar archives directly
    // The path should include 'app.asar' for packaged apps
    let resolvedServerPath = serverPath;
    
    // In packaged apps, files are in app.asar, but Node.js can require them directly
    // We don't need to check if the file exists - Node.js will handle asar archives
    if (app.isPackaged && !resolvedServerPath.includes('app.asar')) {
      // Convert app/server/app.js to app.asar/server/app.js
      resolvedServerPath = resolvedServerPath.replace(
        path.join(process.resourcesPath, 'app'),
        path.join(process.resourcesPath, 'app.asar')
      );
      console.log('Converted to asar path:', resolvedServerPath);
    }
    
    // Require and start the Express server directly
    // This works because we're already in a Node.js process (Electron)
    console.log('Loading server module from:', resolvedServerPath);
    
    try {
      console.log('Attempting to require server from:', resolvedServerPath);
      const expressApp = require(resolvedServerPath);
      console.log('✅ Server module required successfully!');
      console.log('Module exports:', Object.keys(expressApp));
      
      // Give the server time to initialize (database, etc.)
      setTimeout(() => {
        if (expressApp.server) {
          if (expressApp.server.listening) {
            console.log('✅ Server is listening on port 5000!');
            console.log('Server address:', expressApp.server.address());
          } else {
            console.log('⚠️  Server object exists but not listening yet...');
            console.log('Server address:', expressApp.server.address());
            console.log('This might indicate the server failed to start. Check for errors above.');
          }
        } else {
          console.error('❌ Server module loaded but server object is missing!');
          console.log('Available exports:', Object.keys(expressApp));
          console.log('This means the server did not start. Check server/app.js for errors.');
        }
      }, 3000); // Give more time for database initialization
      
      console.log('Server module loaded. Waiting for server to start...');
    } catch (requireError) {
      console.error('❌ Failed to require server module:', requireError);
      console.error('Error message:', requireError.message);
      console.error('Error stack:', requireError.stack);
      
      // Show detailed error in window
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body {
                padding: 20px;
                font-family: Arial, sans-serif;
                background: #FFF5F5;
              }
              h1 { color: #FF0000; }
              pre {
                background: #f0f0f0;
                padding: 10px;
                overflow: auto;
                text-align: left;
                white-space: pre-wrap;
              }
            </style>
          </head>
          <body>
            <h1>Failed to Load Server Module</h1>
            <p><strong>Error:</strong> ${requireError.message}</p>
            <p><strong>Server path attempted:</strong> ${resolvedServerPath}</p>
            <h3>Stack Trace:</h3>
            <pre>${requireError.stack}</pre>
          </body>
          </html>
        `));
      }
      throw requireError;
    }
    
  } catch (error) {
    console.error('Failed to start server:', error);
    console.error('Error stack:', error.stack);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              padding: 20px;
              font-family: Arial, sans-serif;
              background: #FFF5F5;
            }
            h1 { color: #FF0000; }
            pre {
              background: #f0f0f0;
              padding: 10px;
              overflow: auto;
              text-align: left;
            }
          </style>
        </head>
        <body>
          <h1>Failed to Start Server</h1>
          <p><strong>Error:</strong> ${error.message}</p>
          <p><strong>Server path:</strong> ${serverPath}</p>
          <p><strong>Working dir:</strong> ${workingDir}</p>
          <h3>Stack Trace:</h3>
          <pre>${error.stack}</pre>
        </body>
        </html>
      `));
    }
  }

  // In development, also start React dev server
  if (isDev) {
    clientProcess = spawn('npm', ['start'], {
      cwd: clientPath,
      shell: true,
      stdio: 'pipe'
    });

    clientProcess.stdout.on('data', (data) => {
      console.log(`Client: ${data}`);
    });

    clientProcess.stderr.on('data', (data) => {
      console.error(`Client Error: ${data}`);
    });
  }
}

function stopServers() {
  // If we're running the server in-process, we don't need to kill it
  // The process will exit when Electron closes
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
  if (clientProcess) {
    clientProcess.kill();
    clientProcess = null;
  }
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload', label: 'Reload' },
        { role: 'forceReload', label: 'Force Reload' },
        { role: 'toggleDevTools', label: 'Toggle Developer Tools' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Actual Size' },
        { role: 'zoomIn', label: 'Zoom In' },
        { role: 'zoomOut', label: 'Zoom Out' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Toggle Fullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About ExcelStarter Ultra',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About ExcelStarter Ultra',
              message: 'ExcelStarter Ultra',
              detail: 'A beginner-friendly Excel training platform\n\nVersion 1.0.0'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// App event handlers
app.whenReady().then(() => {
  console.log('App is ready, creating window...');
  console.log('Process info:');
  console.log('  - Exec path:', process.execPath);
  console.log('  - App path:', app.getAppPath());
  console.log('  - Resources path:', process.resourcesPath);
  console.log('  - Is packaged:', app.isPackaged);
  console.log('  - __dirname:', __dirname);
  console.log('  - CWD:', process.cwd());
  
  try {
    // Create a simple test window first to verify Electron works
    const testWindow = new BrowserWindow({
      width: 400,
      height: 300,
      show: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });
    
    testWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            padding: 20px;
            font-family: Arial;
            background: #FFF5F5;
            text-align: center;
          }
          h1 { color: #FF69B4; }
        </style>
      </head>
      <body>
        <h1>ExcelStarter Ultra</h1>
        <p>Starting application...</p>
        <p>If you see this, Electron is working!</p>
      </body>
      </html>
    `));
    
    // Close test window after 1 second and create main window
    setTimeout(() => {
      testWindow.close();
      createWindow();
    }, 1000);
    
  } catch (error) {
    console.error('Error creating window:', error);
    console.error('Stack:', error.stack);
    // Try to show error in a dialog
    const { dialog } = require('electron');
    dialog.showErrorBox('Startup Error', `Failed to create window: ${error.message}\n\nStack:\n${error.stack}`);
  }
}).catch((error) => {
  console.error('App ready error:', error);
  console.error('Stack:', error.stack);
  const { dialog } = require('electron');
  dialog.showErrorBox('Startup Error', `Failed to start app: ${error.message}\n\nStack:\n${error.stack}`);
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  stopServers();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  stopServers();
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  // Show error dialog
  const { dialog } = require('electron');
  dialog.showErrorBox('Application Error', `An error occurred: ${error.message}\n\n${error.stack}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

