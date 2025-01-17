import React from 'react';
import type { Reaction } from '../types/message';

interface MessageReactionsProps {
  reactions: Record<string, Reaction>;
  onReact: (emoji: string) => void;
  currentUserId: string;
}

export function MessageReactions({ reactions, onReact, currentUserId }: MessageReactionsProps) {
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {Object.entries(reactions).map(([emoji, reaction]) => (
        <button
          key={emoji}
          onClick={() => onReact(emoji)}
          className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-sm transition-colors ${
            reaction.users.some(user => user.id === currentUserId)
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          title={reaction.users.map(u => u.username).join(', ')}
        >
          <span>{emoji}</span>
          <span>{reaction.users.length}</span>
        </button>
      ))}
    </div>
  );
}