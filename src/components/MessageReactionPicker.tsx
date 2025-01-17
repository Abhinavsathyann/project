import React from 'react';
import { Smile } from 'lucide-react';

const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

interface MessageReactionPickerProps {
  onReact: (emoji: string) => void;
}

export function MessageReactionPicker({ onReact }: MessageReactionPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Add reaction"
      >
        <Smile size={16} />
      </button>
      
      {isOpen && (
        <div className="absolute bottom-full mb-2 -left-2 bg-white rounded-lg shadow-lg p-2 flex space-x-2 z-10 animate-in slide-in-from-bottom-2">
          {REACTIONS.map(emoji => (
            <button
              key={emoji}
              onClick={() => {
                onReact(emoji);
                setIsOpen(false);
              }}
              className="hover:bg-gray-100 p-1.5 rounded-full transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}