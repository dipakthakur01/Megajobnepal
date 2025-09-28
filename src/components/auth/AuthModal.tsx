import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { SignupForm } from './SignupForm';
import { LoginForm } from './LoginForm';
import { OTPVerificationForm } from './OTPVerificationForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { useAuth } from './AuthContext';

type AuthMode = 'login' | 'signup' | 'otp' | 'forgot-password' | 'reset-password';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  isAdminLogin?: boolean;
  targetUserType?: 'jobseeker' | 'employer' | 'admin';
  onLoginSuccess?: (user: any) => void;
}

export function AuthModal({ isOpen, onClose, initialMode = 'login', isAdminLogin = false, targetUserType, onLoginSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [tempSignupId, setTempSignupId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [developmentOTP, setDevelopmentOTP] = useState<string>('');
  const [resetToken, setResetToken] = useState<string>('');
  
  const { user } = useAuth();

  const handleSignupSuccess = (tempId: string, otp?: string) => {
    setTempSignupId(tempId);
    setDevelopmentOTP(otp || '');
    setMode('otp');
  };

  const handleOTPSuccess = () => {
    if (onLoginSuccess && user) {
      onLoginSuccess(user);
    }
    onClose();
  };

  const handleLoginSuccess = () => {
    if (onLoginSuccess && user) {
      onLoginSuccess(user);
    }
    onClose();
  };

  const handleForgotPasswordSuccess = (token?: string) => {
    if (token) {
      setResetToken(token);
      setMode('reset-password');
    }
  };

  const handleResetPasswordSuccess = () => {
    setMode('login');
  };

  const handleSwitchMode = (newMode: AuthMode) => {
    setMode(newMode);
    // Clear any temporary state when switching modes
    if (newMode !== 'otp') {
      setTempSignupId('');
      setDevelopmentOTP('');
    }
    if (newMode !== 'reset-password') {
      setResetToken('');
    }
  };

  const renderForm = () => {
    switch (mode) {
      case 'signup':
        return (
          <SignupForm
            onSuccess={handleLoginSuccess}
            onSwitchToLogin={() => handleSwitchMode('login')}
            onNeedOTPVerification={handleSignupSuccess}
          />
        );
      
      case 'otp':
        return (
          <OTPVerificationForm
            tempSignupId={tempSignupId}
            email={email}
            developmentOTP={developmentOTP}
            onSuccess={handleOTPSuccess}
            onBack={() => handleSwitchMode('signup')}
          />
        );
      
      case 'forgot-password':
        return (
          <ForgotPasswordForm
            onSuccess={handleForgotPasswordSuccess}
            onBack={() => handleSwitchMode('login')}
          />
        );
      
      case 'reset-password':
        return (
          <ResetPasswordForm
            resetToken={resetToken}
            onSuccess={handleResetPasswordSuccess}
          />
        );
      
      default:
        return (
          <LoginForm
            isAdminLogin={isAdminLogin}
            targetUserType={targetUserType}
            onSuccess={handleLoginSuccess}
            onSwitchToSignup={!isAdminLogin ? () => handleSwitchMode('signup') : undefined}
            onForgotPassword={!isAdminLogin ? () => handleSwitchMode('forgot-password') : undefined}
          />
        );
    }
  };

  const getModalTitle = () => {
    switch (mode) {
      case 'signup':
        return 'Create Account';
      case 'otp':
        return 'Verify Email';
      case 'forgot-password':
        return 'Reset Password';
      case 'reset-password':
        return 'Set New Password';
      default:
        return isAdminLogin ? 'Admin Login' : 'Welcome Back';
    }
  };

  const getModalDescription = () => {
    switch (mode) {
      case 'signup':
        return 'Create your MegaJobNepal account to get started';
      case 'otp':
        return 'Enter the verification code sent to your email';
      case 'forgot-password':
        return 'Enter your email to receive a password reset link';
      case 'reset-password':
        return 'Enter your new password';
      default:
        return isAdminLogin ? 'Sign in to admin dashboard' : 'Sign in to your account';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{getModalTitle()}</DialogTitle>
          <DialogDescription>
            {getModalDescription()}
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          {renderForm()}
        </div>
      </DialogContent>
    </Dialog>
  );
}