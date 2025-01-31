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