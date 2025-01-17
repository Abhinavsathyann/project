import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Message } from '../types/message';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { addMessageReaction, fetchAllMessages, sendNewMessage } from '../utils/messageUtils';

export function useMessages(session: any) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!session || !supabase) return;
    const messages = await fetchAllMessages(supabase);
    if (messages) {
      setMessages(messages);
    }
  }, [session]);

  const sendMessage = useCallback(async (content: string, replyTo?: Message) => {
    if (!session || !supabase || !content.trim()) return;

    const optimisticMessage = {
      id: crypto.randomUUID(),
      content: content.trim(),
      user_id: session.user.id,
      username: session.user.user_metadata.username || 'Anonymous',
      created_at: new Date().toISOString(),
      pending: true,
      reactions: {},
      replyTo: replyTo ? {
        id: replyTo.id,
        content: replyTo.content,
        username: replyTo.username
      } : undefined
    };
    
    setMessages(prev => [...prev, optimisticMessage]);

    const success = await sendNewMessage(supabase, {
      content: content.trim(),
      user_id: session.user.id,
      username: session.user.user_metadata.username || 'Anonymous',
      reply_to: replyTo?.id,
      reply_to_content: replyTo?.content,
      reply_to_username: replyTo?.username,
      reactions: {}
    });

    if (!success) {
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
    }
  }, [session]);

  const addReaction = useCallback(async (messageId: string, emoji: string) => {
    if (!session || !supabase) return;

    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    const currentUser = {
      id: session.user.id,
      username: session.user.user_metadata.username || 'Anonymous'
    };

    const { updatedReactions, success } = await addMessageReaction(
      supabase,
      message,
      emoji,
      currentUser
    );

    if (success) {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, reactions: updatedReactions } : msg
      ));
    } else {
      fetchMessages(); // Revert on error
    }
  }, [session, messages, fetchMessages]);

  useEffect(() => {
    if (!session || !supabase) return;

    fetchMessages();

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new as Message;
            setMessages(prev => [...prev.filter(msg => !msg.pending), newMessage]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedMessage = payload.new as Message;
            setMessages(prev => prev.map(msg => 
              msg.id === updatedMessage.id ? updatedMessage : msg
            ));
          }
        }
      )
      .subscribe();

    setChannel(channel);

    return () => {
      channel.unsubscribe();
    };
  }, [session, fetchMessages]);

  return {
    messages,
    sendMessage,
    addReaction,
    fetchMessages
  };
}