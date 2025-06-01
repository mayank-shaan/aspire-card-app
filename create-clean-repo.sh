#!/bin/bash

# Aspire Card App - Clean Repository Script
# This script creates a clean copy without git history

echo "🏦 Aspire Card Management - Clean Repository Setup"
echo "=================================================="

# Get new repository URL
read -p "Enter your new repository URL: " NEW_REPO_URL

if [ -z "$NEW_REPO_URL" ]; then
    echo "❌ Repository URL is required"
    exit 1
fi

# Create clean directory
CLEAN_DIR="aspire-card-clean-$(date +%s)"
echo "📁 Creating clean directory: $CLEAN_DIR"

# Copy files excluding git and build artifacts
rsync -av --progress . "$CLEAN_DIR" \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='dist' \
    --exclude='.DS_Store' \
    --exclude='*.log' \
    --exclude='.vscode' \
    --exclude='temp_cleanup'

# Navigate to clean directory
cd "$CLEAN_DIR"

# Initialize new git repository
echo "🔄 Initializing new git repository..."
git init

# Add all files
echo "📦 Adding files..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Aspire Card Management App

✨ Features:
- Vue 3 + TypeScript + Quasar Framework
- Responsive card management interface  
- Add/freeze card functionality
- Transaction history display
- Mobile and desktop responsive design
- Complete code challenge implementation

🛠️ Tech Stack:
- Frontend: Vue 3.5.13 (Composition API)
- TypeScript: 5.8.0
- UI Framework: Quasar 2.16.9
- Build Tool: Vite 6.2.4
- State Management: Pinia 3.0.1

🚀 Live Demo: https://msd-aspire-card.netlify.app/"

# Add remote and push
echo "🚀 Adding remote and pushing..."
git remote add origin "$NEW_REPO_URL"
git branch -M main
git push -u origin main

echo "✅ Successfully created clean repository!"
echo "📂 Clean code location: $(pwd)"
echo "🔗 Repository URL: $NEW_REPO_URL"
echo ""
echo "Next steps:"
echo "1. cd $CLEAN_DIR"
echo "2. npm install"
echo "3. npm run dev"