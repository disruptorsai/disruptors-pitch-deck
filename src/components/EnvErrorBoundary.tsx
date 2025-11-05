import React from 'react';
import { AlertCircle, Settings, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EnvErrorBoundaryProps {
  children: React.ReactNode;
}

interface EnvErrorBoundaryState {
  hasError: boolean;
  errorMessage: string | null;
  missingVars: string[];
}

export class EnvErrorBoundary extends React.Component<EnvErrorBoundaryProps, EnvErrorBoundaryState> {
  constructor(props: EnvErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: null,
      missingVars: [],
    };
  }

  static getDerivedStateFromError(error: Error): Partial<EnvErrorBoundaryState> {
    // Check if error is related to missing environment variables
    const envVarErrors = [
      'supabaseUrl is required',
      'supabaseKey is required',
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY',
    ];

    const isEnvError = envVarErrors.some((msg) => error.message?.includes(msg));

    if (isEnvError) {
      // Check which variables are missing
      // Only check for truly required client-side variables
      // Note: Service role key and API keys should be server-side only (Netlify Functions)
      const missingVars: string[] = [];
      if (!import.meta.env.VITE_SUPABASE_URL) missingVars.push('VITE_SUPABASE_URL');
      if (!import.meta.env.VITE_SUPABASE_ANON_KEY) missingVars.push('VITE_SUPABASE_ANON_KEY');

      return {
        hasError: true,
        errorMessage: error.message,
        missingVars,
      };
    }

    return { hasError: true, errorMessage: error.message, missingVars: [] };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Environment configuration error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.missingVars.length > 0) {
      return (
        <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center p-6">
          <Card className="max-w-3xl w-full bg-[#1E1E1E] border-red-500/30 p-8">
            <div className="flex items-start gap-4 mb-6">
              <AlertCircle className="w-10 h-10 text-red-500 flex-shrink-0" />
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Configuration Required
                </h1>
                <p className="text-lg text-white/70">
                  The AI Presenter application is missing required environment variables.
                </p>
              </div>
            </div>

            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Missing Environment Variables
              </h2>
              <ul className="space-y-2">
                {this.state.missingVars.map((varName) => (
                  <li key={varName} className="flex items-center gap-2 text-white/90">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <code className="text-sm bg-black/30 px-2 py-1 rounded font-mono">
                      {varName}
                    </code>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <h2 className="text-lg font-semibold text-white mb-3">
                How to Fix (Netlify Deployment)
              </h2>
              <ol className="space-y-3 text-white/80">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <div>
                    <p className="font-medium">Log into Netlify Dashboard</p>
                    <p className="text-sm text-white/60">
                      Visit{' '}
                      <a
                        href="https://app.netlify.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        app.netlify.com
                      </a>
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <div>
                    <p className="font-medium">Navigate to Site Settings</p>
                    <p className="text-sm text-white/60">
                      Site settings → Build & deploy → Environment
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <div>
                    <p className="font-medium">Add Missing Variables</p>
                    <p className="text-sm text-white/60">
                      Add each variable listed above with values from your Supabase dashboard
                      (Project Settings → API)
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  <div>
                    <p className="font-medium">Redeploy Site</p>
                    <p className="text-sm text-white/60">
                      Deploys → Trigger deploy → Clear cache and deploy site
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <h2 className="text-lg font-semibold text-white mb-2">
                Local Development Setup
              </h2>
              <p className="text-white/80 text-sm mb-3">
                If running locally, create a <code className="bg-black/30 px-2 py-0.5 rounded">.env.local</code> file in the project root:
              </p>
              <pre className="bg-black/50 p-3 rounded text-sm text-white/90 overflow-x-auto">
                <code>
                  {this.state.missingVars.map((varName) => `${varName}=your_value_here`).join('\n')}
                </code>
              </pre>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Retry Connection
              </Button>
              <a
                href="https://github.com/yourusername/ai-presenter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  View Documentation
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-sm text-white/50">
                <strong>Error Details:</strong> {this.state.errorMessage}
              </p>
              <p className="text-sm text-white/50 mt-2">
                For more information, see{' '}
                <code className="bg-black/30 px-2 py-0.5 rounded">DEPLOYMENT_VALIDATION_REPORT.md</code>
              </p>
            </div>
          </Card>
        </div>
      );
    }

    if (this.state.hasError) {
      // Generic error fallback
      return (
        <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center p-6">
          <Card className="max-w-2xl w-full bg-[#1E1E1E] border-red-500/30 p-8">
            <div className="flex items-start gap-4 mb-6">
              <AlertCircle className="w-10 h-10 text-red-500 flex-shrink-0" />
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Application Error
                </h1>
                <p className="text-lg text-white/70">
                  An unexpected error occurred while loading the application.
                </p>
              </div>
            </div>

            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-white/90 font-mono text-sm">{this.state.errorMessage}</p>
            </div>

            <Button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Reload Application
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
