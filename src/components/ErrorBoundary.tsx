import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Explicitly declare class properties with their types
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  // Use type assertion to ensure TypeScript understands the props type
  declare public props: ErrorBoundaryProps;
  
  // The setState method is inherited from Component, but we need to help TypeScript understand it
  declare public setState: React.Component<ErrorBoundaryProps, ErrorBoundaryState>['setState'];

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error: error,
      errorInfo: null
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="error-boundary">
          <h2 className="text-xl font-bold mb-2">Something went wrong.</h2>
          <details className="error-details">
            <summary className="error-summary">Error details</summary>
            <p className="text-sm mt-2">{this.state.error?.toString()}</p>
            <p className="text-xs mt-4">Component Stack:</p>
            <p className="text-xs">{this.state.errorInfo?.componentStack}</p>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
