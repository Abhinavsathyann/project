import React from 'react';
import { Check } from 'lucide-react';

interface MessageStatusProps {
  pending?: boolean;
}

export function MessageStatus({ pending }: MessageStatusProps) {
  if (pending) {
    return (
      <span className="ml-2 text-xs text-blue-200 animate-pulse">
        Sending...
      </span>
    );
  }

  return (
    <span className="ml-2 text-xs text-blue-200">
      <Check size={12} className="inline" />
      Sent
    </span>
  );
}