<<<<<<< HEAD
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
=======
import React from 'react';
import { Box, Container, Typography, Avatar, Paper, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';

const FullScreenContainer = styled(Box)({
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#f5f5f5'
});

const ProfileContainer = styled(Container)({
  flex: 1,
  padding: '2rem 0',
  '@media (max-width: 600px)': {
    padding: '1rem 0'
  }
});

const ProfileCard = styled(Paper)({
  padding: '2rem',
  marginBottom: '2rem',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
});

const ProfileHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '2rem',
  gap: '2rem',
  '@media (max-width: 600px)': {
    flexDirection: 'column',
    textAlign: 'center'
  }
});

const LargeAvatar = styled(Avatar)({
  width: 120,
  height: 120,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
});

const ProfileSection = styled(Box)({
  marginBottom: '1.5rem'
});

const ProfilePage: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const renderSkeleton = () => (
    <ProfileCard>
      <ProfileHeader>
        <Skeleton variant="circular" width={120} height={120} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="text" width="40%" height={24} />
        </Box>
      </ProfileHeader>
      <ProfileSection>
        <Skeleton variant="text" width="30%" height={32} />
        <Skeleton variant="rectangular" height={100} sx={{ mt: 1 }} />
      </ProfileSection>
      <ProfileSection>
        <Skeleton variant="text" width="30%" height={32} />
        <Skeleton variant="rectangular" height={150} sx={{ mt: 1 }} />
      </ProfileSection>
    </ProfileCard>
  );

  const renderProfile = () => (
    <ProfileCard>
      <ProfileHeader>
        <LargeAvatar alt="User Profile" src="/placeholder-avatar.png" />
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            User Name
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Member since: January 2024
          </Typography>
        </Box>
      </ProfileHeader>

      <ProfileSection>
        <Typography variant="h6" gutterBottom>
          About
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Profile information will be displayed here once available.
        </Typography>
      </ProfileSection>

      <ProfileSection>
        <Typography variant="h6" gutterBottom>
          Activity
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Recent activity will be shown here when the feature is implemented.
        </Typography>
      </ProfileSection>

      <ProfileSection>
        <Typography variant="h6" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Profile settings and preferences will be accessible here in future updates.
        </Typography>
      </ProfileSection>
    </ProfileCard>
  );

  return (
    <FullScreenContainer>
      <ProfileContainer maxWidth="lg">
        {isLoading ? renderSkeleton() : renderProfile()}
      </ProfileContainer>
    </FullScreenContainer>
  );
};

export default ProfilePage;
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
