import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { mongodbAuthService } from '../../lib/mongodb-auth';
import { User } from '../../lib/mongodb-types';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (data: {
    email: string;
    password: string;
    full_name: string;
    user_type: 'job_seeker' | 'employer';
    phone_number?: string;
  }) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>; // Alias for compatibility
  verifyOTP: (otp: string) => Promise<{ error?: string }>;
  resendOTP: () => Promise<{ error?: string }>;
  forgotPassword: (email: string) => Promise<{ error?: string }>;
  resetPassword: (token: string, password: string) => Promise<{ error?: string }>;
  updateProfile: (updates: Partial<User>) => Promise<{ error?: string }>;
  isAuthenticated: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const currentUser = await mongodbAuthService.getCurrentUser(token);
          if (currentUser) {
            setUser(currentUser);
          } else {
            localStorage.removeItem('auth_token');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('auth_token');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      setLoading(true);
      setError(null);

      const result = await mongodbAuthService.signIn(email, password);
      
      if ('error' in result) {
        setError(result.error);
        return { error: result.error };
      }

      // Store token and user
      localStorage.setItem('auth_token', result.token);
      setUser(result.user);
      
      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData: {
    email: string;
    password: string;
    full_name: string;
    user_type: 'job_seeker' | 'employer';
    phone_number?: string;
  }): Promise<{ error?: string }> => {
    try {
      setLoading(true);
      setError(null);

      const result = await mongodbAuthService.signUp(userData);
      
      if ('error' in result) {
        setError(result.error);
        return { error: result.error };
      }

      // Store user ID for OTP verification
      setPendingUserId(result.user.id!);
      
      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (otp: string): Promise<{ error?: string }> => {
    try {
      setLoading(true);
      setError(null);

      if (!pendingUserId) {
        setError('No pending verification found');
        return { error: 'No pending verification found' };
      }

      const result = await mongodbAuthService.verifyOTP(pendingUserId, otp);
      
      if (!result.success) {
        setError(result.error || 'OTP verification failed');
        return { error: result.error || 'OTP verification failed' };
      }

      // Get updated user and generate token
      const updatedUser = await mongodbAuthService.getCurrentUser(pendingUserId);
      if (updatedUser) {
        const token = mongodbAuthService.generateToken({
          userId: updatedUser.id!,
          email: updatedUser.email,
          userType: updatedUser.user_type,
        });
        
        localStorage.setItem('auth_token', token);
        setUser(updatedUser);
        setPendingUserId(null);
      }

      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'OTP verification failed';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async (): Promise<{ error?: string }> => {
    try {
      setError(null);

      if (!pendingUserId) {
        setError('No pending verification found');
        return { error: 'No pending verification found' };
      }

      const result = await mongodbAuthService.resendOTP(pendingUserId);
      
      if (!result.success) {
        setError(result.error || 'Failed to resend OTP');
        return { error: result.error || 'Failed to resend OTP' };
      }

      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend OTP';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  const forgotPassword = async (email: string): Promise<{ error?: string }> => {
    try {
      setError(null);

      const result = await mongodbAuthService.forgotPassword(email);
      
      if (!result.success) {
        setError(result.error || 'Failed to send reset email');
        return { error: result.error || 'Failed to send reset email' };
      }

      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<{ error?: string }> => {
    try {
      setLoading(true);
      setError(null);

      const result = await mongodbAuthService.resetPassword(token, newPassword);
      
      if (!result.success) {
        setError(result.error || 'Failed to reset password');
        return { error: result.error || 'Failed to reset password' };
      }

      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset password';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ error?: string }> => {
    try {
      setError(null);

      if (!user?.id) {
        setError('Not authenticated');
        return { error: 'Not authenticated' };
      }

      const updatedUser = await mongodbAuthService.updateProfile(user.id, updates);
      
      if (updatedUser) {
        setUser(updatedUser);
        return {};
      } else {
        setError('Failed to update profile');
        return { error: 'Failed to update profile' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      localStorage.removeItem('auth_token');
      setUser(null);
      setPendingUserId(null);
      setError(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    error,
    signIn,
    signUp,
    signOut,
    logout: signOut, // Alias for compatibility
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;