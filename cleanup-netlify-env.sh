#!/bin/bash
# Netlify Environment Variables Cleanup Script
# This script removes unused environment variables from Netlify to fix the 4KB limit error

echo "🧹 Netlify Environment Variables Cleanup"
echo "=========================================="
echo ""
echo "This script will remove unused environment variables from Netlify."
echo "Make sure you have Netlify CLI installed: npm install -g netlify-cli"
echo ""

# Check if netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Error: Netlify CLI not found"
    echo "Install it with: npm install -g netlify-cli"
    exit 1
fi

echo "✅ Netlify CLI found"
echo ""

# Confirm with user
read -p "⚠️  Do you want to proceed with deleting unused env vars? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "🗑️  Deleting unused environment variables..."
echo ""

# List of variables to delete (not used in the codebase)
VARS_TO_DELETE=(
    "TWITTER_API_KEY"
    "TWITTER_API_SECRET"
    "LINKEDIN_CLIENT_ID"
    "LINKEDIN_CLIENT_SECRET"
    "FACEBOOK_ACCESS_TOKEN"
    "YOUTUBE_API_KEY"
    "NEWSAPI_AI_KEY"
    "CORESIGNAL_API_KEY"
    "BRIGHT_DATA_API_KEY"
    "BRIGHT_DATA_ZONE"
    "FMP_API_KEY"
    "CRUNCHBASE_API_KEY"
    "VITE_ANALYTICS_ENABLED"
    "VITE_GA_ID"
    "VITE_DEBUG"
    "VITE_VERBOSE_LOGGING"
    "VITE_SENTRY_DSN"
    "SENTRY_AUTH_TOKEN"
    "VITE_POSTHOG_KEY"
    "VITE_POSTHOG_HOST"
    "VITE_SUPABASE_DATABASE_URL"
)

# Delete each variable
for var in "${VARS_TO_DELETE[@]}"; do
    echo "Removing: $var"
    netlify env:unset "$var" 2>/dev/null || echo "  (not found, skipping)"
done

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📊 Remaining environment variables:"
netlify env:list

echo ""
echo "🚀 Next steps:"
echo "1. Go to Netlify Dashboard → Deploys"
echo "2. Click 'Trigger deploy' → 'Clear cache and deploy site'"
echo "3. Monitor the build logs to verify the deployment succeeds"
echo ""
echo "For more details, see: NETLIFY_ENV_CLEANUP.md"
