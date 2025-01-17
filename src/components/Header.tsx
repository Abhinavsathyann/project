import React from 'react';
import { MessageSquare, LogOut, Menu } from 'lucide-react';
import type { Session, SupabaseClient } from '@supabase/supabase-js';

interface HeaderProps {
  session: Session;
  supabase: SupabaseClient;
}

export function Header({ session, supabase }: HeaderProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleSignOut = () => {
    supabase?.auth.signOut();
    setMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-blue-500 flex-shrink-0" />
            <h1 className="text-xl font-semibold text-gray-900 hidden sm:block">Real-time Chat</h1>
            <h1 className="text-xl font-semibold text-gray-900 sm:hidden">Chat</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="hidden sm:block text-sm text-gray-600">
              Logged in as {session.user.user_metadata.username || 'Anonymous'}
            </span>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="sm:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                <Menu size={20} />
              </button>
              <button
                onClick={handleSignOut}
                className="hidden sm:flex items-center space-x-1 text-gray-600 hover:text-gray-900"
              >
                <LogOut size={18} />
                <span>Sign out</span>
              </button>
              
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 sm:hidden">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}