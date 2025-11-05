#!/bin/bash
# Netlify Build Diagnostic Script
# This script provides detailed diagnostics to help debug build issues

echo "=== Netlify Build Diagnostics ==="
echo "Date: $(date)"
echo "PWD: $(pwd)"
echo "Node Version: $(node --version)"
echo "NPM Version: $(npm --version)"
echo ""

echo "=== Directory Structure ==="
ls -la
echo ""

echo "=== Checking package.json ==="
if [ -f "package.json" ]; then
    echo "package.json exists"
    cat package.json | grep -A 3 '"scripts"'
    echo ""
    cat package.json | grep -A 15 '"devDependencies"'
else
    echo "ERROR: package.json not found!"
    exit 1
fi
echo ""

echo "=== Checking for vite in node_modules (before install) ==="
ls -la node_modules/.bin/ | grep vite || echo "vite not found in node_modules/.bin/"
echo ""

echo "=== Installing Dependencies ==="
npm ci --include=dev
echo ""

echo "=== Checking for vite in node_modules (after install) ==="
ls -la node_modules/.bin/ | grep vite || echo "vite not found in node_modules/.bin/"
echo ""

echo "=== Verifying vite installation ==="
npx vite --version || echo "ERROR: vite command not found!"
echo ""

echo "=== Running Build ==="
npm run build
BUILD_EXIT_CODE=$?

echo ""
echo "=== Build Exit Code: $BUILD_EXIT_CODE ==="

exit $BUILD_EXIT_CODE
