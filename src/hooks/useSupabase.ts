import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useSupabase() {
  const [isInitialized, setIsInitialized] = useState(!!supabase);
  const [session, setSession] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setError('Supabase client is not initialized');
      return;
    }

    const initializeSupabase = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(data.session);
        setError(null);
      } catch (err) {
        setError('Failed to connect to the chat server');
        console.error('Supabase initialization error:', err);
      }
    };

    initializeSupabase();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    isInitialized,
    session,
    supabase,
    error
  };
}