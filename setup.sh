#!/bin/bash

# StudentHub API - Quick Setup Script

echo "🚀 StudentHub API - Quick Setup"
echo "================================"
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "✓ .env file already exists"
else
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "✓ .env file created"
    echo "⚠️  Please update DATABASE_URL and JWT_SECRET in .env file"
fi

echo ""
echo "Installing dependencies..."
npm install

echo ""
echo "Generating Prisma Client..."
npm run prisma:generate

echo ""
echo "================================"
echo "✓ Setup completed!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your database credentials"
echo "2. Run: npm run prisma:migrate"
echo "3. Run: npm run dev"
echo ""
echo "API will be available at: http://localhost:3000"
echo "Health check: http://localhost:3000/health"
echo ""
