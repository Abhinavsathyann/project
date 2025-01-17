export interface FileAttachment {
  url: string;
  name: string;
  size: number;
  type: string;
  thumbnailUrl?: string;
}

export interface VoiceAttachment {
  url: string;
  duration: number;
  waveform: number[];
}

export interface Reaction {
  emoji: string;
  users: Array<{
    id: string;
    username: string;
  }>;
}

export interface Message {
  id: string;
  content: string;
  user_id: string;
  username: string;
  created_at: string;
  pending?: boolean;
  reactions?: Record<string, Reaction>;
  fileAttachment?: FileAttachment;
  voiceAttachment?: VoiceAttachment;
  replyTo?: {
    id: string;
    content: string;
    username: string;
  };
  uploadProgress?: number;
}