import React from 'react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ConvexReactClient } from 'convex/react';
import { useAuth } from '@clerk/clerk-react';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL || "");

interface ConvexProviderProps {
  children: React.ReactNode;
}

const ConvexProvider: React.FC<ConvexProviderProps> = ({ children }) => {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
};

export default ConvexProvider;
