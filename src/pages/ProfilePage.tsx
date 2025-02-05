import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user && navigate) {
      navigate('/auth');
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6">
          <img
            className="w-32 h-32 rounded-full border-2 border-gray-300"
            src={user.user_metadata?.avatar_url || '/placeholder-avatar.png'}
            alt="User Profile"
          />
          <div className="mt-4 md:mt-0 text-center md:text-left">
            <h1 className="text-3xl font-bold">{user.user_metadata?.full_name || user.email}</h1>
            <p className="text-gray-600">
              Membre depuis : {new Date(user.created_at).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">À propos</h2>
          <p className="text-gray-700">
            Les informations du profil seront affichées ici une fois disponibles.
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Activité</h2>
          <p className="text-gray-700">
            L'activité récente sera affichée ici lorsque la fonctionnalité sera implémentée.
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Paramètres</h2>
          <p className="text-gray-700">
            Les paramètres et préférences du profil seront accessibles ici dans les futures mises à jour.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
