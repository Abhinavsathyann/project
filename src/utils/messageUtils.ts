import type { SupabaseClient } from '@supabase/supabase-js';
import type { Message } from '../types/message';

export async function fetchAllMessages(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return null;
  }

  return data?.map(message => ({
    ...message,
    reactions: message.reactions || {},
    replyTo: message.reply_to ? {
      id: message.reply_to,
      content: message.reply_to_content,
      username: message.reply_to_username
    } : undefined
  }));
}

export async function sendNewMessage(
  supabase: SupabaseClient,
  messageData: {
    content: string;
    user_id: string;
    username: string;
    reply_to?: string;
    reply_to_content?: string;
    reply_to_username?: string;
    reactions: Record<string, any>;
  }
) {
  const { error } = await supabase
    .from('messages')
    .insert([messageData]);

  if (error) {
    console.error('Error sending message:', error);
    return false;
  }
  return true;
}

export async function addMessageReaction(
  supabase: SupabaseClient,
  message: Message,
  emoji: string,
  currentUser: { id: string; username: string }
) {
  const reactions = { ...message.reactions } || {};
  const reaction = reactions[emoji] || { emoji, users: [] };
  const userIndex = reaction.users.findIndex(u => u.id === currentUser.id);

  if (userIndex >= 0) {
    reaction.users.splice(userIndex, 1);
    if (reaction.users.length === 0) {
      delete reactions[emoji];
    } else {
      reactions[emoji] = reaction;
    }
  } else {
    reaction.users.push(currentUser);
    reactions[emoji] = reaction;
  }

  const { error } = await supabase
    .from('messages')
    .update({ reactions })
    .eq('id', message.id);

  if (error) {
    console.error('Error updating reaction:', error);
    return { success: false, updatedReactions: null };
  }

  return { success: true, updatedReactions: reactions };
}