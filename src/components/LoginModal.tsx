import React from 'react';
import { AuthModal } from './auth/AuthModal';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: (user: any) => void; // Legacy prop for compatibility
  onLoginSuccess?: (user: any) => void;
  targetUserType?: 'jobseeker' | 'employer' | 'admin';
}

export function LoginModal({ isOpen, onClose, onLogin, onLoginSuccess, targetUserType }: LoginModalProps) {
  return (
    <AuthModal
      isOpen={isOpen}
      onClose={onClose}
      initialMode="login"
      targetUserType={targetUserType}
      onLoginSuccess={onLogin || onLoginSuccess}
    />
  );
}