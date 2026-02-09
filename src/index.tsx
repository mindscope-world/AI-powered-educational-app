import './index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

// Check if we're running in a browser environment
const isBrowser = typeof window !== 'undefined' && window.document;

// Function to render the app
const renderApp = () => {
  try {
    // Ensure the root element exists
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error("Could not find root element with id 'root'");
    }

    // Create root and render the app
    const root = createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );

    // Log when the app is successfully mounted
    console.log('Application mounted successfully');
    
  } catch (error) {
    console.error('Failed to mount application:', error);
    
    // Display error message in the UI if possible
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 2rem; color: #dc2626; background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 0.5rem; margin: 1rem;">
          <h2 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 0.5rem;">Application Error</h2>
          <p>Failed to initialize the application. Please check the console for more details.</p>
          <p style="margin-top: 1rem; font-family: monospace; font-size: 0.875rem; color: #7f1d1d;">
            ${error instanceof Error ? error.message : String(error)}
          </p>
        </div>
      `;
    }
  }
};

// Only attempt to render if we're in a browser environment
if (isBrowser) {
  // Add error handling for unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
  });

  // Add error handling for uncaught errors
  window.addEventListener('error', (event) => {
    console.error('Uncaught error:', event.error || event.message);
  });

  // Render the app when the DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderApp);
  } else {
    renderApp();
  }
} else {
  console.error('This application must be run in a browser environment');
}
