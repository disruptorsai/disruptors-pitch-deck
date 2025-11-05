#!/bin/bash
# Cleanup insecure environment variables from Netlify
# This script removes VITE_ prefixed API keys that should be server-side only

echo "🧹 Cleaning up insecure environment variables..."
echo ""

# Variables to DELETE (insecure - exposed to browser)
INSECURE_VARS=(
  "VITE_ANTHROPIC_API_KEY"
  "VITE_FIRECRAWL_API_KEY"
  "VITE_OPENAI_API_KEY"
  "VITE_SERPAPI_KEY"
  "VITE_SUPABASE_SERVICE_ROLE_KEY"
)

for var in "${INSECURE_VARS[@]}"; do
  echo "🗑️  Deleting $var..."
  npx netlify env:unset "$var" --context dev --context deploy-preview --context production --context branch-deploy || echo "   Failed to delete $var (may not exist)"
done

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "Remaining secure variables:"
echo "  ✅ ANTHROPIC_API_KEY (server-side)"
echo "  ✅ SUPABASE_SERVICE_ROLE_KEY (server-side)"
echo "  ✅ OPENAI_API_KEY (server-side)"
echo "  ✅ SERPAPI_KEY (server-side)"
echo "  ✅ FIRECRAWL_API_KEY (server-side)"
echo "  ✅ VITE_SUPABASE_URL (client-side, safe)"
echo "  ✅ VITE_SUPABASE_ANON_KEY (client-side, safe)"
echo ""
echo "⚠️  IMPORTANT: Run 'npx netlify deploy --prod' to rebuild with clean environment"
