import React from 'react';
import { MessageSquare, RefreshCw } from 'lucide-react';

interface SetupRequiredProps {
  error?: string;
  onRetry?: () => void;
}

export function SetupRequired({ error, onRetry }: SetupRequiredProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <MessageSquare className="mx-auto h-12 w-12 text-blue-500" />
        <h1 className="text-2xl font-bold text-gray-900">
          {error ? 'Connection Error' : 'Setup Required'}
        </h1>
        <p className="text-gray-600">
          {error ? (
            <>
              Unable to connect to the chat server. Please check your connection and try again.
              <br />
              <button
                onClick={onRetry}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Connection
              </button>
            </>
          ) : (
            'Please click the "Connect to Supabase" button in the top right corner to set up your chat application.'
          )}
        </p>
      </div>
    </div>
  );
}