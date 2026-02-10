#!/bin/bash

echo "========================================"
echo "  ExcelStarter Ultra - Starting..."
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please download and install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies... This may take a few minutes."
    npm run install-all
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dependencies!"
        exit 1
    fi
fi

echo ""
echo "Starting the application..."
echo "Please wait for 'Compiled successfully' message."
echo ""
echo "The app will open in your browser automatically."
echo ""
echo "To stop the app, press Ctrl+C in this window"
echo ""

# Start the app in background
npm run dev &
APP_PID=$!

# Wait for server to start
sleep 8

# Open browser (Mac)
if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:3000
# Open browser (Linux)
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open http://localhost:3000
fi

echo ""
echo "========================================"
echo "  Application started!"
echo "  Browser should open automatically."
echo "  If not, go to: http://localhost:3000"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop the application"

# Wait for user to stop
wait $APP_PID

