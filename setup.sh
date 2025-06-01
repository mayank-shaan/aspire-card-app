#!/bin/bash

echo "🚀 Setting up Aspire Card Management App..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOL
VITE_APP_TITLE=Aspire Card App
VITE_API_BASE_URL=http://localhost:3000/api
EOL
fi

echo "✅ Setup complete!"
echo ""
echo "🎯 Available commands:"
echo "  npm run dev     - Start development server"
echo "  npm run build   - Build for production"
echo "  npm run test    - Run tests"
echo "  npm run lint    - Lint code"
echo ""
echo "🌐 Ready to start: npm run dev"
