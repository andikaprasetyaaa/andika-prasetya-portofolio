import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/** Last-resort screen if the app itself fails to render. */
class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Portfolio failed to render:', error, errorInfo);
  }

  public render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-night-900 p-6 text-ink">
        <div className="panel panel-accent w-full max-w-xl p-7">
          <p className="hud-label !text-vice-pink">SYSTEM FAULT</p>
          <h1 className="mt-3 font-display text-4xl uppercase leading-none">Something went wrong</h1>
          <p className="mt-4 text-ink-soft">The page hit an unexpected error while rendering. Reloading usually fixes it.</p>
          <pre className="mt-4 overflow-x-auto rounded-md border border-white/10 bg-night-950 p-4 font-mono text-xs text-vice-coral">
            {this.state.error?.message || 'Unknown runtime error'}
          </pre>
          <button type="button" onClick={() => window.location.reload()} className="btn btn-primary mt-6">
            RELOAD
          </button>
        </div>
      </div>
    );
  }
}

const container = document.getElementById('root');
if (container) {
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  );
}
