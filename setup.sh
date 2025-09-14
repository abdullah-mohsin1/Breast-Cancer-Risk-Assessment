#!/bin/bash

# Breast Cancer Detector Setup Script
echo "🏥 Setting up Breast Cancer Risk Classifier..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed. Please install Python 3.10+ and try again."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed. Please install Node.js 18+ and try again."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Backend setup
echo "🔧 Setting up backend..."
cd backend

# Create virtual environment
echo "Creating Python virtual environment..."
python3 -m venv .venv

# Activate virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Set up environment file
if [ ! -f .env ]; then
    echo "Creating environment file..."
    cp env.example .env
    echo "📝 Please edit backend/.env file with your configuration"
fi

# Run Django migrations
echo "Running Django migrations..."
python manage.py migrate

echo "✅ Backend setup complete"

# Frontend setup
echo "🔧 Setting up frontend..."
cd ../frontend

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

echo "✅ Frontend setup complete"

# Return to root directory
cd ..

echo ""
echo "🎉 Setup complete! To start the application:"
echo ""
echo "Backend (Terminal 1):"
echo "  cd backend"
echo "  source .venv/bin/activate"
echo "  python manage.py runserver 0.0.0.0:8000"
echo ""
echo "Frontend (Terminal 2):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then visit: http://localhost:5173"
echo ""
echo "⚠️  Remember: This tool is for research purposes only!"

