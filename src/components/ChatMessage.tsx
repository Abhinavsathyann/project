import React, { useRef, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MessageStatus } from './MessageStatus';
import { MessageReactionPicker } from './MessageReactionPicker';
import { MessageReactions } from './MessageReactions';
import { Reply, Play, Pause, FileText, Image, Film, Music } from 'lucide-react';
import type { Message } from '../types/message';
import { formatDuration } from '../utils/timeUtils';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
  onReact: (messageId: string, emoji: string) => void;
  onReply: (message: Message) => void;
  currentUserId: string;
}

function getFileIcon(type: string) {
  switch (type) {
    case 'image':
      return <Image size={20} />;
    case 'video':
      return <Film size={20} />;
    case 'audio':
      return <Music size={20} />;
    default:
      return <FileText size={20} />;
  }
}

export function ChatMessage({
  message,
  isCurrentUser,
  onReact,
  onReply,
  currentUserId
}: ChatMessageProps) {
  const messageRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { isPlaying, togglePlay } = useAudioPlayer(message.voiceAttachment?.url);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', message.id);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div 
      ref={messageRef}
      className={`group flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className={`
          relative max-w-[85%] sm:max-w-[75%] rounded-lg px-3 py-2
          ${isDragging ? 'opacity-50' : ''}
          ${isCurrentUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'}
        `}
      >
        {message.replyTo && (
          <div className={`text-xs mb-1 ${isCurrentUser ? 'text-blue-200' : 'text-gray-600'}`}>
            Replying to {message.replyTo.username}
            <p className="truncate">{message.replyTo.content}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-2">
          <span className={`text-sm font-semibold ${
            isCurrentUser ? 'text-blue-100' : 'text-gray-600'
          }`}>
            {message.username}
          </span>
          <div className="flex items-center text-xs">
            <span className={isCurrentUser ? 'text-blue-200' : 'text-gray-500'}>
              {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
            </span>
            {isCurrentUser && <MessageStatus pending={message.pending} />}
          </div>
        </div>

        <p className="mt-1 break-words">{message.content}</p>

        {message.fileAttachment && (
          <div className="mt-2">
            {message.fileAttachment.type === 'image' ? (
              <img
                src={message.fileAttachment.url}
                alt={message.content}
                className="max-w-full rounded-lg"
              />
            ) : (
              <a
                href={message.fileAttachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 p-2 rounded-lg ${
                  isCurrentUser ? 'bg-blue-400 hover:bg-blue-300' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              >
                {getFileIcon(message.fileAttachment.type)}
                <span className="text-sm truncate">{message.content}</span>
              </a>
            )}
          </div>
        )}

        {message.voiceAttachment && (
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={togglePlay}
              className={`p-1.5 rounded-full ${
                isCurrentUser ? 'bg-blue-400 hover:bg-blue-300' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <div className="text-sm">
              {formatDuration(message.voiceAttachment.duration || 0)}
            </div>
          </div>
        )}

        {message.reactions && (
          <MessageReactions
            reactions={message.reactions}
            onReact={(emoji) => onReact(message.id, emoji)}
            currentUserId={currentUserId}
          />
        )}

        <div className={`
          absolute ${isCurrentUser ? '-left-8' : '-right-8'} top-2
          opacity-0 group-hover:opacity-100 transition-opacity
          flex flex-col gap-1
        `}>
          <MessageReactionPicker
            onReact={(emoji) => onReact(message.id, emoji)}
          />
          <button
            onClick={() => onReply(message)}
            className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Reply"
          >
            <Reply size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}