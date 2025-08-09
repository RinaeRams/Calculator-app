#!/bin/bash

# Dynamic Calculator Web App Startup Script
echo "🧮 Starting Dynamic Calculator Web App..."
echo "========================================"

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 and try again."
    exit 1
fi

# Check if Flask is installed
if ! python3 -c "import flask" &> /dev/null; then
    echo "📦 Installing Flask dependencies..."
    pip install --break-system-packages Flask==2.3.3 Werkzeug==2.3.7
fi

# Start the Flask application
echo "🚀 Starting Flask server..."
echo "📱 Open your browser and navigate to: http://localhost:5000"
echo "⌨️  Press Ctrl+C to stop the server"
echo ""

python3 app.py