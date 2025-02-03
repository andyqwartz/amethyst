import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@supabase/supabase-js';

interface UserProfileProps {
  user: User;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold">Welcome, {user.email}</h2>
      <button onClick={handleSignOut} className="mt-2 text-red-500">
        Sign Out
      </button>
    </div>
  );
};
