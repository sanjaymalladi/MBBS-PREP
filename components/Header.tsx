import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { UserButton } from '@clerk/clerk-react';

interface HeaderProps {
  onShowErrorLog?: () => void;
  showErrorLog?: boolean;
  onShowDashboard?: () => void;
  showDashboard?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onShowErrorLog, showErrorLog, onShowDashboard, showDashboard }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 py-4 md:px-8 md:py-5">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
              MBBS Prepper
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">AI-Powered Practice for the CBME Curriculum</p>
          </div>

          <div className="flex items-center gap-4">
            {onShowDashboard && (
              <button
                onClick={onShowDashboard}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showDashboard
                    ? 'bg-purple-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                Dashboard
              </button>
            )}
            {onShowErrorLog && (
              <button
                onClick={onShowErrorLog}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showErrorLog
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                Error Log
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8"
                }
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;