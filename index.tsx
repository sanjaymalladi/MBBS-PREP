import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import ClerkProvider from './components/ClerkProvider';
import ConvexProvider from './components/ConvexProvider';
import AuthWrapper from './components/AuthWrapper';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ClerkProvider>
      <ConvexProvider>
        <ThemeProvider>
          <AuthWrapper>
            <App />
          </AuthWrapper>
        </ThemeProvider>
      </ConvexProvider>
    </ClerkProvider>
  </React.StrictMode>
);