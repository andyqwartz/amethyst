import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/useToast';

const ToastContainer = styled(motion.div)`
  position: fixed;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  pointer-events: none;
  left: 50%;
  transform: translateX(-50%);
  
  @media (min-width: 640px) {
    top: 2rem;
    width: auto;
  }

  @media (max-width: 639px) {
    top: 1rem;
    padding: 0 1rem;
  }
`;

const ToastItem = styled(motion.div)`
  background: var(--toast-background, rgba(0, 0, 0, 0.95));
  color: var(--toast-text, white);
  border-radius: 1rem;
  padding: 0.875rem 1.25rem;
  min-width: 320px;
  max-width: 90vw;
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-weight: 500;
  
  @media (max-width: 639px) {
    width: calc(100% - 2rem);
    min-width: unset;
    margin: 0 auto;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: inherit;
  padding: 0.25rem;
  margin-left: 1rem;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.2s ease;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;

  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const toastVariants = {
  initial: {
    opacity: 0,
    y: -20,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      duration: 0.3,
      ease: [0.36, 0, 0.66, -0.56],
    },
  },
};

export const ToastComponent: React.FC = () => {
  const { toasts, removeToast } = useToast();

  useEffect(() => {
    toasts.forEach((toast) => {
      if (toast.duration) {
        const timer = setTimeout(() => {
          removeToast(toast.id);
        }, toast.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [toasts, removeToast]);

  return (
    <ToastContainer>
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            layout
            variants={toastVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              backgroundColor: toast.type === 'error' ? 'var(--color-error)' : 
                             toast.type === 'success' ? 'var(--color-success)' : 
                             'var(--toast-background)',
            }}
          >
            <span>{toast.message}</span>
            <CloseButton
              onClick={() => removeToast(toast.id)}
              aria-label="Fermer la notification"
            >
              ×
            </CloseButton>
          </ToastItem>
        ))}
      </AnimatePresence>
    </ToastContainer>
  );
};

export default ToastComponent;
