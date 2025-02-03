import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export const UserProfile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    }
  };

  if (!user) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold">User Profile</h2>
      <p>Email: {user.email}</p>
      <button onClick={handleSignOut} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
        Sign Out
      </button>
    </div>
  );
};
