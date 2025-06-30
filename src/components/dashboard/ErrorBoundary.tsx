import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// This component needs to be a class component because error boundaries
// must be class components in React
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default fallback UI
      return (
        <div className="rounded-xl p-4 text-center bg-gradient-to-br from-gray-900/80 to-black/90 border-red-500/30 backdrop-blur-xl border shadow-md">
          <div className="flex flex-col items-center">
            <div className="bg-red-500/20 p-3 rounded-lg mb-3">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            
            <h3 className="text-lg font-bold mb-2 text-white">
              Something went wrong
            </h3>
            
            <p className="mb-3 text-white/70 text-sm">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            
            {this.state.error && (
              <div className="p-3 rounded-lg mb-4 text-left overflow-auto max-w-full text-xs font-mono bg-black/50 text-red-400">
                <p className="whitespace-pre-wrap break-words">
                  {this.state.error.stack?.split('\n').slice(0, 3).join('\n')}
                </p>
              </div>
            )}
            
            <button
              onClick={this.resetError}
              className="bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold px-4 py-2 rounded-lg hover:scale-105 transition-all duration-300 flex items-center space-x-1 text-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;