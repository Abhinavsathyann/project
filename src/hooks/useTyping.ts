import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { TypingUser } from '../types/message';

export function useTyping(session: any) {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  
  useEffect(() => {
    if (!session || !supabase) return;

    const channel = supabase.channel('typing');
    
    channel
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        const typingUser = payload as TypingUser;
        if (typingUser.id !== session.user.id) {
          setTypingUsers(users => {
            if (!users.find(u => u.id === typingUser.id)) {
              return [...users, typingUser];
            }
            return users;
          });
          
          // Remove user after 3 seconds
          setTimeout(() => {
            setTypingUsers(users => users.filter(u => u.id !== typingUser.id));
          }, 3000);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  const broadcastTyping = async () => {
    if (!session || !supabase) return;
    
    await supabase.channel('typing').send({
      type: 'broadcast',
      event: 'typing',
      payload: {
        id: session.user.id,
        username: session.user.user_metadata.username
      }
    });
  };

  return {
    typingUsers,
    broadcastTyping
  };
}