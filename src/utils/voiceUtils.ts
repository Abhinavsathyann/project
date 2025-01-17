import { supabase } from '../lib/supabase';

export async function uploadVoiceMessage(
  blob: Blob,
  duration: number,
  waveform: number[]
): Promise<{ url: string } | null> {
  try {
    const fileName = `voice-${Date.now()}.wav`;
    
    const { data, error } = await supabase.storage
      .from('chat-files')
      .upload(fileName, blob, {
        contentType: 'audio/wav'
      });

    if (error) {
      console.error('Error uploading voice message:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('chat-files')
      .getPublicUrl(data.path);

    return {
      url: publicUrl
    };
  } catch (error) {
    console.error('Error uploading voice message:', error);
    return null;
  }
}