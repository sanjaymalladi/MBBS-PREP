import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  return (
    <>
      <SignedOut>
        <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
            <h1 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-slate-200">
              MBBS Prepper
            </h1>
            <p className="text-center text-slate-600 dark:text-slate-300 mb-6">
              Sign in to access your MCQ practice sessions and error logs
            </p>
            <div className="text-center">
              <SignInButton mode="modal">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        {children}
      </SignedIn>
    </>
  );
};

export default AuthWrapper;
