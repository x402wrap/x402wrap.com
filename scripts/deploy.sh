#!/bin/bash

echo "🚀 x402wrap Deployment Script"
echo "================================"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if logged in
echo "🔐 Checking Vercel authentication..."
vercel whoami &> /dev/null

if [ $? -ne 0 ]; then
    echo "Please login to Vercel:"
    vercel login
fi

# Build locally first
echo "🔨 Building project locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Fix errors before deploying."
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Deploy
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Go to your Vercel dashboard"
echo "2. Add environment variable: NEXT_PUBLIC_BASE_URL with your domain"
echo "3. Configure your custom domain in Settings > Domains"
echo ""
echo "🎉 Your API monetization platform is LIVE!"

