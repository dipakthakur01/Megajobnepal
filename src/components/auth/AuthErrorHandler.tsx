import React from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { RefreshCw, AlertTriangle, ExternalLink } from 'lucide-react';

interface AuthErrorHandlerProps {
  error: string | null;
  onRetry?: () => void;
  showTroubleshooting?: boolean;
}

export function AuthErrorHandler({ error, onRetry, showTroubleshooting = true }: AuthErrorHandlerProps) {
  if (!error) return null;

  const isNetworkError = error.includes('Network') || error.includes('fetch');
  const isConfigError = error.includes('configuration') || error.includes('database');
  const isCredentialError = error.includes('Invalid') || error.includes('password');

  const getErrorType = () => {
    if (isNetworkError) return 'Network Error';
    if (isConfigError) return 'Configuration Error';
    if (isCredentialError) return 'Authentication Error';
    return 'Error';
  };

  const getErrorMessage = () => {
    if (isNetworkError) {
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    }
    if (isConfigError) {
      return 'The authentication system is not properly configured. Please contact support.';
    }
    if (isCredentialError) {
      return 'Invalid email or password. Please check your credentials and try again.';
    }
    return error;
  };

  const getSuggestions = () => {
    if (isNetworkError) {
      return [
        'Check your internet connection',
        'Try refreshing the page',
        'Disable any VPN or proxy',
        'Try again in a few minutes'
      ];
    }
    if (isConfigError) {
      return [
        'Contact system administrator',
        'Check if the service is under maintenance',
        'Try the demo mode if available'
      ];
    }
    if (isCredentialError) {
      return [
        'Double-check your email and password',
        'Make sure Caps Lock is off',
        'Try resetting your password if you forgot it',
        'Create a new account if you don\'t have one'
      ];
    }
    return [
      'Try refreshing the page',
      'Clear your browser cache',
      'Try again in a few minutes',
      'Contact support if the problem persists'
    ];
  };

  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">{getErrorType()}</p>
            <p>{getErrorMessage()}</p>
          </div>
        </AlertDescription>
      </Alert>

      {showTroubleshooting && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Troubleshooting Steps:</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            {getSuggestions().map((suggestion, index) => (
              <li key={index} className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center space-x-3">
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open('/auth-test', '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Test Authentication
        </Button>
      </div>
    </div>
  );
}