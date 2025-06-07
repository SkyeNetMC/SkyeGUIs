#!/bin/bash

# Clean previous builds
rm -rf .next out

# Build the Next.js application with static export
echo "Building Next.js application..."
pnpm build

# Verify the output directory exists and show its size
if [ -d "out" ]; then
    echo "✅ Static export completed successfully"
    echo "📁 Output directory size:"
    du -sh out/
    echo "📄 Files in output directory:"
    find out/ -type f | head -20
else
    echo "❌ Static export failed - no output directory found"
    exit 1
fi

echo "🚀 Ready for Cloudflare Pages deployment"
echo "💡 Deploy the 'out' directory to Cloudflare Pages"
