import React, { useRef, useState } from 'react';
import { FileUp, X, Image, FileText, Film, Music } from 'lucide-react';
import { formatFileSize } from '../../utils/fileUtils';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  onCancel: () => void;
  uploadProgress?: number;
}

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const ALLOWED_TYPES = [
  'image/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'video/*',
  'audio/*'
];

export function FileUploader({ onFileSelect, onCancel, uploadProgress }: FileUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds 25MB limit');
      return;
    }

    if (!ALLOWED_TYPES.some(type => {
      const [category, subtype] = type.split('/');
      return subtype === '*' ? 
        file.type.startsWith(category) : 
        file.type === type;
    })) {
      setError('File type not supported');
      return;
    }

    setError(null);
    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    onFileSelect(file);
  };

  const getFileIcon = () => {
    if (!selectedFile) return <FileUp />;
    if (selectedFile.type.startsWith('image/')) return <Image />;
    if (selectedFile.type.startsWith('video/')) return <Film />;
    if (selectedFile.type.startsWith('audio/')) return <Music />;
    return <FileText />;
  };

  return (
    <div className="relative p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept={ALLOWED_TYPES.join(',')}
        className="hidden"
      />

      {error && (
        <div className="text-red-500 text-sm mb-2">{error}</div>
      )}

      {selectedFile ? (
        <div className="space-y-2">
          {preview && (
            <div className="relative w-48 h-48 mx-auto">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getFileIcon()}
              <div>
                <div className="text-sm font-medium truncate max-w-[200px]">
                  {selectedFile.name}
                </div>
                <div className="text-xs text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </div>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>
          {typeof uploadProgress === 'number' && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full text-center p-4"
        >
          <FileUp className="mx-auto mb-2" />
          <div className="text-sm text-gray-600">
            Click to upload file (max 25MB)
          </div>
          <div className="text-xs text-gray-500">
            Supports images, PDF, DOC, video, and audio
          </div>
        </button>
      )}
    </div>
  );
}