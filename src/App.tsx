import React, { useState } from 'react';
import { AuthForm } from './components/AuthForm';
import { SetupRequired } from './components/SetupRequired';
import { Header } from './components/Header';
import { ChatContainer } from './components/ChatContainer';
import { useSupabase } from './hooks/useSupabase';
import { useMessages } from './hooks/useMessages';

export default function App() {
  const { isInitialized, session, supabase, error } = useSupabase();
  const { messages, sendMessage, addReaction, fetchMessages } = useMessages(session);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    await fetchMessages();
    setIsRetrying(false);
  };

  if (!isInitialized || error) {
    return <SetupRequired error={error} onRetry={handleRetry} />;
  }

  if (!session) {
    return <AuthForm />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header session={session} supabase={supabase} />
      <ChatContainer
        messages={messages}
        currentUserId={session.user.id}
        onSendMessage={sendMessage}
        onReact={addReaction}
      />
    </div>
  );
}