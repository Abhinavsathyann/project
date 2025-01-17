import React from 'react';

interface ReplyPreviewProps {
  username: string;
  content: string;
  onClose: () => void;
}

export function ReplyPreview({ username, content, onClose }: ReplyPreviewProps) {
  return (
    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg mb-2">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">
          Replying to {username}
        </p>
        <p className="text-sm text-gray-500 truncate">
          {content}
        </p>
      </div>
      <button
        onClick={onClose}
        className="ml-2 text-gray-400 hover:text-gray-600"
      >
        ×
      </button>
    </div>
  );
}