import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Terraria Application Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#0a0a0f',
          color: '#e2e8f0',
          padding: '2rem',
          fontFamily: "'JetBrains Mono', monospace",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            maxWidth: '600px',
            border: '2px solid #ef4444',
            backgroundColor: '#121217',
            padding: '1.5rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.8)'
          }}>
            <h1 style={{ color: '#ef4444', fontSize: '18px', marginBottom: '1rem', fontFamily: "'Press Start 2P', cursive" }}>
              [!] EXCAVATION BREACH
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '1rem' }}>
              A subterranean anomaly interrupted the biome rendering engine.
            </p>
            <pre style={{
              backgroundColor: '#000',
              padding: '1rem',
              color: '#f87171',
              fontSize: '11px',
              overflowX: 'auto',
              border: '1px solid #334155'
            }}>
              {this.state.error?.message || 'Unknown runtime error'}
            </pre>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '1.25rem',
                backgroundColor: '#58a038',
                color: '#000',
                border: 'none',
                padding: '0.6rem 1.2rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontFamily: "'Silkscreen', monospace"
              }}
            >
              RESPAWN AT SURFACE (RELOAD)
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}

