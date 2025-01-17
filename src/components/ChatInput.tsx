import React, { useState } from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';
import { FileUploader } from './attachments/FileUploader';
import { VoiceRecorder } from './attachments/VoiceRecorder';
import { uploadFile } from '../utils/fileUtils';
import { uploadVoiceMessage } from '../utils/voiceUtils';

interface ChatInputProps {
  onSendMessage: (content: string, attachment?: { url: string; type: string; duration?: number; waveform?: number[] }) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [showFileUploader, setShowFileUploader] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleFileSelect = async (file: File) => {
    const result = await uploadFile(file, setUploadProgress);
    if (result) {
      onSendMessage(file.name, result);
      setShowFileUploader(false);
      setUploadProgress(undefined);
    }
  };

  const handleVoiceSend = async (blob: Blob, duration: number, waveform: number[]) => {
    const result = await uploadVoiceMessage(blob, duration, waveform);
    if (result) {
      onSendMessage('Voice message', {
        url: result.url,
        type: 'voice',
        duration,
        waveform
      });
      setShowVoiceRecorder(false);
    }
  };

  return (
    <div className="space-y-2">
      {showFileUploader && (
        <FileUploader
          onFileSelect={handleFileSelect}
          onCancel={() => setShowFileUploader(false)}
          uploadProgress={uploadProgress}
        />
      )}

      {showVoiceRecorder && (
        <VoiceRecorder
          onSend={handleVoiceSend}
          onCancel={() => setShowVoiceRecorder(false)}
        />
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setShowFileUploader(true);
            setShowVoiceRecorder(false);
          }}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          title="Attach file"
        >
          <Paperclip size={20} />
        </button>

        <button
          type="button"
          onClick={() => {
            setShowVoiceRecorder(true);
            setShowFileUploader(false);
          }}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          title="Record voice message"
        >
          <Mic size={20} />
        </button>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 text-sm sm:text-base border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <button
          type="submit"
          disabled={!message.trim()}
          className="p-2 text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}