import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { SignupForm } from './SignupForm';
import { LoginForm } from './LoginForm';
import { OTPVerificationForm } from './OTPVerificationForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { AuthDebugInfo } from './AuthDebugInfo';
import { AuthStatus } from './AuthStatus';
import { useAuth } from './AuthContext';
import { CheckCircle, XCircle, Clock, User, LogOut } from 'lucide-react';

export function AuthTestPage() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [otpData, setOtpData] = useState<{ tempSignupId: string; otp?: string } | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { status: 'success' | 'error' | 'pending'; message: string }>>({});

  const handleSignupSuccess = (tempSignupId: string, otp?: string) => {
    setOtpData({ tempSignupId, otp });
    setActiveTab('otp');
  };

  const handleOTPSuccess = () => {
    setOtpData(null);
    setActiveTab('profile');
  };

  const handleForgotPasswordSuccess = (token?: string) => {
    if (token) {
      setResetToken(token);
      setActiveTab('reset');
    }
  };

  const handleResetPasswordSuccess = () => {
    setResetToken(null);
    setActiveTab('login');
  };

  const handleLoginSuccess = () => {
    setActiveTab('profile');
  };

  const handleLogout = async () => {
    try {
      await logout();
      setActiveTab('login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const runAuthTest = async (testName: string, testFn: () => Promise<void>) => {
    setTestResults(prev => ({
      ...prev,
      [testName]: { status: 'pending', message: 'Running test...' }
    }));

    try {
      await testFn();
      setTestResults(prev => ({
        ...prev,
        [testName]: { status: 'success', message: 'Test passed' }
      }));
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        [testName]: { status: 'error', message: error.message || 'Test failed' }
      }));
    }
  };

  const getStatusIcon = (status: 'success' | 'error' | 'pending') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />;
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Welcome, {user.first_name} {user.last_name}!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Email:</strong> {user.email}
                </div>
                <div>
                  <strong>Role:</strong> <Badge variant="outline">{user.role}</Badge>
                </div>
                <div>
                  <strong>Verified:</strong> <Badge variant={user.is_verified ? 'default' : 'destructive'}>
                    {user.is_verified ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div>
                  <strong>Active:</strong> <Badge variant={user.is_active ? 'default' : 'destructive'}>
                    {user.is_active ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div>
                  <strong>Phone:</strong> {user.phone || 'Not provided'}
                </div>
                <div>
                  <strong>Last Login:</strong> {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <AuthDebugInfo />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>MegaJobNepal Authentication System</CardTitle>
          <p className="text-sm text-gray-600">
            Test all authentication features including signup, login, OTP verification, and password reset.
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AuthStatus />
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <AuthDebugInfo />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Test Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => setActiveTab('signup')}
              className="w-full"
            >
              Test Signup Flow
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveTab('login')}
              className="w-full"
            >
              Test Login Flow
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Signup</TabsTrigger>
          <TabsTrigger value="otp" disabled={!otpData}>OTP</TabsTrigger>
          <TabsTrigger value="forgot">Forgot Password</TabsTrigger>
          <TabsTrigger value="reset" disabled={!resetToken}>Reset Password</TabsTrigger>
          <TabsTrigger value="profile" disabled={!isAuthenticated}>Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <LoginForm
            onSuccess={handleLoginSuccess}
            onSwitchToSignup={() => setActiveTab('signup')}
            onForgotPassword={() => setActiveTab('forgot')}
          />
        </TabsContent>

        <TabsContent value="signup">
          <SignupForm
            onSuccess={handleLoginSuccess}
            onSwitchToLogin={() => setActiveTab('login')}
            onNeedOTPVerification={handleSignupSuccess}
          />
        </TabsContent>

        <TabsContent value="otp">
          {otpData && (
            <OTPVerificationForm
              tempSignupId={otpData.tempSignupId}
              email=""
              onSuccess={handleOTPSuccess}
              onResend={() => {}}
              developmentOTP={otpData.otp}
            />
          )}
        </TabsContent>

        <TabsContent value="forgot">
          <ForgotPasswordForm
            onSuccess={handleForgotPasswordSuccess}
            onBackToLogin={() => setActiveTab('login')}
          />
        </TabsContent>

        <TabsContent value="reset">
          {resetToken && (
            <ResetPasswordForm
              resetToken={resetToken}
              onSuccess={handleResetPasswordSuccess}
              onBackToLogin={() => setActiveTab('login')}
            />
          )}
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Successful!</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <CheckCircle className="w-4 h-4" />
                <AlertDescription>
                  You have successfully authenticated. The system is working correctly.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Test Results */}
      {Object.keys(testResults).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(testResults).map(([testName, result]) => (
                <div key={testName} className="flex items-center justify-between p-2 border rounded">
                  <span className="font-medium">{testName}</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    <span className="text-sm">{result.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}