import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const UserProfile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  if (!user) return null;

  return (
    <div className="p-4">
      <div className="flex items-center gap-4">
        <img src={user.user_metadata.avatar_url} alt="User Avatar" className="w-12 h-12 rounded-full" />
        <div>
          <h2 className="text-lg font-semibold">{user.user_metadata.full_name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        <button onClick={handleSignOut} className="ml-auto text-red-500 hover:underline">
          Sign Out
        </button>
      </div>
    </div>
  );
};
