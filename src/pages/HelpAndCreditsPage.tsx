import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Typography, Container, Link } from '@mui/material';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

const floatAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const PageContainer = styled(Container)`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const LogoContainer = styled.div`
  margin: 2rem 0;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const AnimatedLogo = styled.img`
  width: 150px;
  height: auto;
  animation: ${floatAnimation} 3s ease-in-out infinite;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const ContentSection = styled.section`
  max-width: 800px;
  width: 100%;
  margin: 2rem auto;
  text-align: left;
`;

const HelpAndCreditsPage: React.FC = () => {
  return (
    <PageContainer component="main">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <LogoContainer>
          <AnimatedLogo
            src={logo}
            alt="Amethyst Logo"
            role="img"
          />
        </LogoContainer>

        <ContentSection>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Help & Credits
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
            How to Use Amethyst
          </Typography>
          <Typography paragraph>
            Amethyst is designed to be intuitive and user-friendly. Follow these steps to get started:
          </Typography>
          <Typography component="ul" sx={{ pl: 3 }}>
            <li>Select your desired image generation options</li>
            <li>Input your prompt in the text field</li>
            <li>Click generate to create your image</li>
            <li>Use the gallery to view and manage your creations</li>
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
            Credits
          </Typography>
          <Typography paragraph>
            Amethyst is made possible thanks to the following technologies and contributors:
          </Typography>
          <Typography component="ul" sx={{ pl: 3 }}>
            <li>React Framework</li>
            <li>Material-UI Components</li>
            <li>Stable Diffusion</li>
            <li>Community Contributors</li>
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
            Support
          </Typography>
          <Typography paragraph>
            For additional support or to report issues, please visit our{' '}
            <Link
              href="https://github.com/yourusername/amethyst"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository (opens in new tab)"
            >
              GitHub repository
            </Link>
            .
          </Typography>
        </ContentSection>
      </motion.div>
    </PageContainer>
  );
};

export default HelpAndCreditsPage;