import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ReplyPreview } from './ReplyPreview';
import type { Message } from '../types/message';

interface ChatContainerProps {
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string, replyTo?: Message) => void;
  onReact: (messageId: string, emoji: string) => void;
}

export function ChatContainer({
  messages,
  currentUserId,
  onSendMessage,
  onReact
}: ChatContainerProps) {
  const [replyTo, setReplyTo] = useState<Message | undefined>();
  const containerRef = useRef<HTMLDivElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    dropZoneRef.current?.classList.add('bg-blue-50');
  };

  const handleDragLeave = () => {
    dropZoneRef.current?.classList.remove('bg-blue-50');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const messageId = e.dataTransfer.getData('text/plain');
    const message = messages.find(m => m.id === messageId);
    if (message) {
      setReplyTo(message);
    }
    dropZoneRef.current?.classList.remove('bg-blue-50');
  };

  return (
    <>
      <main
        ref={containerRef}
        className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4"
      >
        <div className="max-w-3xl mx-auto space-y-3">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isCurrentUser={message.user_id === currentUserId}
              onReact={onReact}
              onReply={setReplyTo}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      </main>

      <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 pb-2 sm:pb-4 pt-2">
        <div
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="rounded-lg border-2 border-dashed border-gray-200 transition-colors"
        >
          {replyTo && (
            <ReplyPreview
              username={replyTo.username}
              content={replyTo.content}
              onClose={() => setReplyTo(undefined)}
            />
          )}
          <ChatInput
            onSendMessage={(content) => {
              onSendMessage(content, replyTo);
              setReplyTo(undefined);
            }}
          />
        </div>
      </div>
    </>
  );
}