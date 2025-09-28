import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Shield, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { LoginForm } from './auth/LoginForm';
import { useAuth } from './auth/AuthContext';

interface AdminLoginProps {
  onLogin: (user: any) => void;
  onBackToWebsite: () => void;
}

export function AdminLogin({ onLogin, onBackToWebsite }: AdminLoginProps) {
  const { user } = useAuth();

  const handleLoginSuccess = () => {
    if (user) {
      onLogin(user);
      toast.success('Welcome to Admin Panel!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Website Button */}
        <Button
          variant="ghost"
          onClick={onBackToWebsite}
          className="mb-6 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Website
        </Button>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">Admin Login</CardTitle>
            <p className="text-gray-600 mt-2">Access the MegaJobNepal Admin Panel</p>
          </CardHeader>
          
          <CardContent className="pt-2">
            <div className="space-y-4">
              <LoginForm
                isAdminLogin={true}
                onSuccess={handleLoginSuccess}
              />
            </div>

            <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm text-purple-800 mb-2 font-medium">🔑 Admin Demo Access</p>
              <div className="space-y-1 text-xs text-purple-700">
                <p><strong>Email:</strong> admin.demo@megajobnepal.com</p>
                <p><strong>Password:</strong> admin123</p>
                <p className="text-purple-600 mt-2">Click "Use Demo Admin Account" button above to auto-fill</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            © 2024 MegaJobNepal. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}