import React, { useRef } from 'react';
import { Paperclip } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FileUploadProps {
  onFileSelect: (url: string, type: string) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from('chat-files')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading file:', error);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('chat-files')
      .getPublicUrl(data.path);

    onFileSelect(publicUrl, file.type);
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
        title="Attach file"
      >
        <Paperclip size={20} />
      </button>
    </div>
  );
}