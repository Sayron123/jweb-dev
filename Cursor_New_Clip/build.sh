#!/bin/bash
echo "Building TypeScript files..."
npm install
npm run build
echo "Build complete! Check the dist/ folder for compiled files."
