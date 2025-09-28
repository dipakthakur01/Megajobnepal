import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Checkbox } from '../ui/checkbox';
import { Eye, EyeOff, Mail, Lock, Info } from 'lucide-react';
import { useAuth } from './AuthContext';
import { AuthDebugInfo } from './AuthDebugInfo';
import { AuthFlowGuide } from './AuthFlowGuide';
import { AuthErrorHandler } from './AuthErrorHandler';
import { isSupabaseConfigured } from '../../lib/auth-config';
import { toast } from 'sonner@2.0.3';

interface LoginFormProps {
  isAdminLogin?: boolean;
  targetUserType?: 'jobseeker' | 'employer' | 'admin';
  onSuccess?: (user?: any) => void;
  onSwitchToSignup?: () => void;
  onForgotPassword?: () => void;
}

export function LoginForm({ 
  isAdminLogin = false,
  targetUserType,
  onSuccess, 
  onSwitchToSignup, 
  onForgotPassword 
}: LoginFormProps) {
  const { signIn, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    console.log('🔐 Attempting login for:', email);

    try {
      const result = await signIn(email, password);
      
      if (result.error) {
        console.error('❌ Login error:', result.error);
        toast.error("Login failed. Please check your credentials.");
        
        // Add specific handling for demo accounts
        if (email.includes('.demo@megajobnepal.com')) {
          console.warn('⚠️ Demo account login failed. This might be a setup issue.');
          console.log('💡 Try visiting /demo page to verify account status');
        }
        return;
      }
      
      console.log('✅ Login successful for:', email);
      toast.success("Login successful! Welcome back.");
      
      // TODO: Implement remember me functionality
      if (rememberMe) {
        // Store some indication that user wants to be remembered
        localStorage.setItem('rememberMe', 'true');
      }
      
      onSuccess?.();
    } catch (err) {
      console.error('💥 Login exception:', err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      
      {error && error.includes('fetch') && <AuthDebugInfo />}
      {error && error.includes('configuration') && <AuthDebugInfo />}
      {error && error.includes('Invalid') && !isAdminLogin && <AuthFlowGuide />}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {isAdminLogin ? 'Admin Login' : 'Welcome Back'}
          </CardTitle>
          {!isAdminLogin && (
            <p className="text-sm text-gray-600 text-center">
              Sign in to your account to continue
            </p>
          )}
        </CardHeader>
        <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <AuthErrorHandler 
              error={error} 
              onRetry={() => {
                clearError();
                setEmail('');
                setPassword('');
                setValidationErrors({});
              }}
            />
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="pl-10"
                required
              />
            </div>
            {validationErrors.email && (
              <p className="text-sm text-red-600">{validationErrors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {validationErrors.password && (
              <p className="text-sm text-red-600">{validationErrors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={setRememberMe}
              />
              <Label htmlFor="remember-me" className="text-sm text-gray-600">
                Remember me
              </Label>
            </div>
            
            {!isAdminLogin && onForgotPassword && (
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Forgot password?
              </button>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>



          {!isAdminLogin && onSwitchToSignup && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToSignup}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
    </div>
  );
}