import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { CheckCircle, XCircle, TestTube2, User, Building2, Shield, Loader2 } from 'lucide-react';
import { dbService } from '../../lib/mongodb-fixed';
import { mongodbAuthService } from '../../lib/mongodb-auth';

interface DemoAccount {
  email: string;
  password: string;
  userType: 'job_seeker' | 'employer' | 'admin';
  name: string;
  icon: React.ComponentType<any>;
  color: string;
}

const demoAccounts: DemoAccount[] = [
  {
    email: 'jobseeker.demo@megajobnepal.com',
    password: 'jobseeker123',
    userType: 'job_seeker',
    name: 'Job Seeker Demo',
    icon: User,
    color: 'text-green-600'
  },
  {
    email: 'employer.demo@megajobnepal.com',
    password: 'employer123',
    userType: 'employer',
    name: 'Employer Demo',
    icon: Building2,
    color: 'text-blue-600'
  },
  {
    email: 'admin.demo@megajobnepal.com',
    password: 'admin123',
    userType: 'admin',
    name: 'Admin Demo',
    icon: Shield,
    color: 'text-purple-600'
  },
  {
    email: 'hr.demo@megajobnepal.com',
    password: 'hr123',
    userType: 'admin',
    name: 'HR Manager Demo',
    icon: Shield,
    color: 'text-orange-600'
  }
];

interface AccountStatus {
  email: string;
  exists: boolean;
  verified: boolean;
  canLogin: boolean;
  error?: string;
}

export function DemoAccountVerifier() {
  const [checking, setChecking] = useState(false);
  const [accountStatuses, setAccountStatuses] = useState<AccountStatus[]>([]);
  const [overallStatus, setOverallStatus] = useState<'unknown' | 'good' | 'issues'>('unknown');

  const checkDemoAccounts = async () => {
    setChecking(true);
    const statuses: AccountStatus[] = [];

    for (const account of demoAccounts) {
      try {
        // Check if user exists in database
        const user = await dbService.getUserByEmail(account.email);
        
        if (!user) {
          statuses.push({
            email: account.email,
            exists: false,
            verified: false,
            canLogin: false,
            error: 'User not found in database'
          });
          continue;
        }

        // Check if user is verified
        const isVerified = user.is_verified;

        // Test login functionality
        let canLogin = false;
        try {
          const loginResult = await mongodbAuthService.signIn(account.email, account.password);
          canLogin = !('error' in loginResult);
        } catch (error) {
          console.error(`Login test failed for ${account.email}:`, error);
        }

        statuses.push({
          email: account.email,
          exists: true,
          verified: isVerified,
          canLogin,
          error: !canLogin ? 'Login failed' : undefined
        });

      } catch (error) {
        statuses.push({
          email: account.email,
          exists: false,
          verified: false,
          canLogin: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    setAccountStatuses(statuses);
    
    // Determine overall status
    const allGood = statuses.every(s => s.exists && s.verified && s.canLogin);
    setOverallStatus(allGood ? 'good' : 'issues');
    setChecking(false);
  };

  const fixDemoAccounts = async () => {
    setChecking(true);
    
    try {
      // Run database setup to create/fix demo accounts
      await dbService.setupDatabase();
      
      // Recheck after fixing
      setTimeout(() => {
        checkDemoAccounts();
      }, 1000);
    } catch (error) {
      console.error('Failed to fix demo accounts:', error);
      setChecking(false);
    }
  };

  useEffect(() => {
    checkDemoAccounts();
  }, []);

  const getStatusIcon = (status: AccountStatus) => {
    if (status.canLogin) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else {
      return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: AccountStatus) => {
    if (status.canLogin) {
      return <Badge className="bg-green-100 text-green-800">Ready</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">Issue</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube2 className="h-5 w-5 text-orange-600" />
          Demo Account Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {overallStatus === 'good' && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ✅ All demo accounts are working correctly! You can use any of the accounts below to test the application.
            </AlertDescription>
          </Alert>
        )}

        {overallStatus === 'issues' && (
          <Alert className="bg-red-50 border-red-200">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              ⚠️ Some demo accounts have issues. Click "Fix Demo Accounts" to resolve them.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          {accountStatuses.map((status, index) => {
            const account = demoAccounts[index];
            const IconComponent = account.icon;
            
            return (
              <div key={status.email} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(status)}
                  <IconComponent className={`h-4 w-4 ${account.color}`} />
                  <div>
                    <div className="font-medium">{account.name}</div>
                    <div className="text-sm text-gray-600">{status.email}</div>
                    {status.error && (
                      <div className="text-xs text-red-600">{status.error}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(status)}
                  {status.canLogin && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // Auto-fill login form if available
                        const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
                        const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
                        
                        if (emailInput && passwordInput) {
                          emailInput.value = account.email;
                          passwordInput.value = account.password;
                          
                          // Trigger change events
                          emailInput.dispatchEvent(new Event('input', { bubbles: true }));
                          passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                      }}
                    >
                      Use Account
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={checkDemoAccounts}
            disabled={checking}
            variant="outline"
            size="sm"
          >
            {checking ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Recheck Status
          </Button>
          
          {overallStatus === 'issues' && (
            <Button
              onClick={fixDemoAccounts}
              disabled={checking}
              size="sm"
            >
              {checking ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Fix Demo Accounts
            </Button>
          )}
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Status Check:</strong> Verifies account exists, is verified, and can login</p>
          <p><strong>Fix Accounts:</strong> Recreates demo accounts with correct verification status</p>
        </div>
      </CardContent>
    </Card>
  );
}