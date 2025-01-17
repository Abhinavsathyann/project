import React from 'react';
import { RefreshCw } from 'lucide-react';

interface RefreshButtonProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export function RefreshButton({ onRefresh, isLoading }: RefreshButtonProps) {
  return (
    <button
      onClick={onRefresh}
      disabled={isLoading}
      className="flex items-center space-x-1 px-3 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
      title="Refresh messages"
    >
      <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
      <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
    </button>
  );
}