#!/bin/bash

echo "🚀 Starting NearbyNomad Backend Setup..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "✅ .env file created. Please edit it with your API keys."
else
    echo "✅ .env file already exists"
fi

# Check if .env has been configured
if grep -q "your_.*_here" .env; then
    echo "⚠️  Warning: Please update your .env file with actual API keys"
    echo "   - Google Maps API key (optional)"
    echo "   - Uber API credentials (optional)"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file with your API keys (optional)"
echo "2. Start the server: npm run dev"
echo "3. Test the backend: node test-backend.js"
echo ""
echo "🌐 Server will be available at: http://localhost:8080"
echo "📚 API documentation: See README.md"
echo ""
echo "Happy coding! 🚀"
