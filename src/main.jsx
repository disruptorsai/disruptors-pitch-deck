import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/index.css'

// Dynamically import App to catch any module initialization errors
async function loadApp() {
  try {
    const { default: App } = await import('@/App.jsx');
    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  } catch (error) {
    console.error('Failed to load application:', error);

    // Display error directly in DOM if App fails to load
    const root = document.getElementById('root');
    if (root) {
      root.innerHTML = `
        <div style="min-height: 100vh; background-color: #0E0E0E; display: flex; align-items: center; justify-content: center; padding: 24px; font-family: system-ui, -apple-system, sans-serif;">
          <div style="max-width: 48rem; width: 100%; background-color: #1E1E1E; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 32px;">
            <div style="display: flex; align-items: flex-start; gap: 16px; margin-bottom: 24px;">
              <svg style="width: 40px; height: 40px; color: rgb(239, 68, 68); flex-shrink: 0;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <div>
                <h1 style="font-size: 1.875rem; font-weight: bold; color: white; margin-bottom: 8px;">
                  Configuration Error
                </h1>
                <p style="font-size: 1.125rem; color: rgba(255, 255, 255, 0.7);">
                  The AI Presenter application is missing required environment variables.
                </p>
              </div>
            </div>

            <div style="margin-bottom: 24px; padding: 16px; background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 6px;">
              <h2 style="font-size: 1.25rem; font-weight: 600; color: white; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                <svg style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Missing Environment Variables
              </h2>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: rgba(255, 255, 255, 0.9);">
                  <span style="width: 8px; height: 8px; background-color: rgb(239, 68, 68); border-radius: 50%;"></span>
                  <code style="font-size: 0.875rem; background-color: rgba(0, 0, 0, 0.3); padding: 4px 8px; border-radius: 4px; font-family: monospace;">VITE_SUPABASE_URL</code>
                </li>
                <li style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: rgba(255, 255, 255, 0.9);">
                  <span style="width: 8px; height: 8px; background-color: rgb(239, 68, 68); border-radius: 50%;"></span>
                  <code style="font-size: 0.875rem; background-color: rgba(0, 0, 0, 0.3); padding: 4px 8px; border-radius: 4px; font-family: monospace;">VITE_SUPABASE_ANON_KEY</code>
                </li>
                <li style="display: flex; align-items: center; gap: 8px; color: rgba(255, 255, 255, 0.9);">
                  <span style="width: 8px; height: 8px; background-color: rgb(239, 68, 68); border-radius: 50%;"></span>
                  <code style="font-size: 0.875rem; background-color: rgba(0, 0, 0, 0.3); padding: 4px 8px; border-radius: 4px; font-family: monospace;">VITE_ANTHROPIC_API_KEY</code>
                </li>
              </ul>
            </div>

            <div style="margin-bottom: 24px; padding: 16px; background-color: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 6px;">
              <h2 style="font-size: 1.125rem; font-weight: 600; color: white; margin-bottom: 12px;">
                How to Fix (Netlify Deployment)
              </h2>
              <ol style="list-style: none; padding: 0; margin: 0; color: rgba(255, 255, 255, 0.8);">
                <li style="display: flex; gap: 12px; margin-bottom: 16px;">
                  <span style="flex-shrink: 0; width: 24px; height: 24px; background-color: rgb(59, 130, 246); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.875rem; font-weight: bold;">1</span>
                  <div>
                    <p style="margin: 0; font-weight: 500;">Log into Netlify Dashboard</p>
                    <p style="margin: 4px 0 0 0; font-size: 0.875rem; color: rgba(255, 255, 255, 0.6);">Visit <a href="https://app.netlify.com" target="_blank" style="color: rgb(96, 165, 250);">app.netlify.com</a></p>
                  </div>
                </li>
                <li style="display: flex; gap: 12px; margin-bottom: 16px;">
                  <span style="flex-shrink: 0; width: 24px; height: 24px; background-color: rgb(59, 130, 246); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.875rem; font-weight: bold;">2</span>
                  <div>
                    <p style="margin: 0; font-weight: 500;">Navigate to Site Settings</p>
                    <p style="margin: 4px 0 0 0; font-size: 0.875rem; color: rgba(255, 255, 255, 0.6);">Site settings → Build & deploy → Environment</p>
                  </div>
                </li>
                <li style="display: flex; gap: 12px; margin-bottom: 16px;">
                  <span style="flex-shrink: 0; width: 24px; height: 24px; background-color: rgb(59, 130, 246); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.875rem; font-weight: bold;">3</span>
                  <div>
                    <p style="margin: 0; font-weight: 500;">Add Missing Variables</p>
                    <p style="margin: 4px 0 0 0; font-size: 0.875rem; color: rgba(255, 255, 255, 0.6);">Add each variable listed above with values from your Supabase and Anthropic dashboards</p>
                  </div>
                </li>
                <li style="display: flex; gap: 12px;">
                  <span style="flex-shrink: 0; width: 24px; height: 24px; background-color: rgb(59, 130, 246); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.875rem; font-weight: bold;">4</span>
                  <div>
                    <p style="margin: 0; font-weight: 500;">Redeploy Site</p>
                    <p style="margin: 4px 0 0 0; font-size: 0.875rem; color: rgba(255, 255, 255, 0.6);">Deploys → Trigger deploy → Clear cache and deploy site</p>
                  </div>
                </li>
              </ol>
            </div>

            <button onclick="window.location.reload()" style="background-color: rgb(37, 99, 235); color: white; border: none; padding: 10px 20px; border-radius: 6px; font-size: 1rem; cursor: pointer; font-weight: 500;">
              Retry Connection
            </button>

            <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
              <p style="font-size: 0.875rem; color: rgba(255, 255, 255, 0.5); margin: 0;">
                <strong>Error Details:</strong> ${error.message || 'Failed to initialize application'}
              </p>
            </div>
          </div>
        </div>
      `;
    }
  }
}

loadApp(); 