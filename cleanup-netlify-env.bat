@echo off
REM Netlify Environment Variables Cleanup Script (Windows)
REM This script removes unused environment variables from Netlify to fix the 4KB limit error

echo.
echo ========================================
echo Netlify Environment Variables Cleanup
echo ========================================
echo.
echo This script will remove unused environment variables from Netlify.
echo Make sure you have Netlify CLI installed: npm install -g netlify-cli
echo.

REM Check if netlify CLI is installed
where netlify >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Netlify CLI not found
    echo Install it with: npm install -g netlify-cli
    exit /b 1
)

echo [OK] Netlify CLI found
echo.

REM Confirm with user
set /p CONFIRM="Do you want to proceed with deleting unused env vars? (y/N): "
if /i not "%CONFIRM%"=="y" (
    echo Cancelled.
    exit /b 0
)

echo.
echo Deleting unused environment variables...
echo.

REM Delete unused variables
call :delete_var TWITTER_API_KEY
call :delete_var TWITTER_API_SECRET
call :delete_var LINKEDIN_CLIENT_ID
call :delete_var LINKEDIN_CLIENT_SECRET
call :delete_var FACEBOOK_ACCESS_TOKEN
call :delete_var YOUTUBE_API_KEY
call :delete_var NEWSAPI_AI_KEY
call :delete_var CORESIGNAL_API_KEY
call :delete_var BRIGHT_DATA_API_KEY
call :delete_var BRIGHT_DATA_ZONE
call :delete_var FMP_API_KEY
call :delete_var CRUNCHBASE_API_KEY
call :delete_var VITE_ANALYTICS_ENABLED
call :delete_var VITE_GA_ID
call :delete_var VITE_DEBUG
call :delete_var VITE_VERBOSE_LOGGING
call :delete_var VITE_SENTRY_DSN
call :delete_var SENTRY_AUTH_TOKEN
call :delete_var VITE_POSTHOG_KEY
call :delete_var VITE_POSTHOG_HOST
call :delete_var VITE_SUPABASE_DATABASE_URL

echo.
echo [OK] Cleanup complete!
echo.
echo Remaining environment variables:
netlify env:list

echo.
echo Next steps:
echo 1. Go to Netlify Dashboard - Deploys
echo 2. Click 'Trigger deploy' - 'Clear cache and deploy site'
echo 3. Monitor the build logs to verify the deployment succeeds
echo.
echo For more details, see: NETLIFY_ENV_CLEANUP.md
echo.
pause
exit /b 0

:delete_var
echo Removing: %1
netlify env:unset %1 2>nul
if %ERRORLEVEL% neq 0 (
    echo   (not found, skipping)
)
exit /b 0
