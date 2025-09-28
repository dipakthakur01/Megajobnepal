import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  User, 
  Building2, 
  Shield, 
  Info, 
  ChevronRight,
  TestTube2
} from 'lucide-react';

interface DemoCredentialsProps {
  onUseCredentials?: (email: string, password: string, userType: string) => void;
  showTitle?: boolean;
  compact?: boolean;
}

// Demo accounts are now defined in Guidelines.md
// Use the credentials from the Guidelines file for testing
const demoAccounts = [
  {
    id: 'jobseeker',
    name: 'Job Seeker Demo',
    email: 'jobseeker.demo@megajobnepal.com',
    password: 'jobseeker123',
    userType: 'job_seeker',
    icon: User,
    description: 'Access job seeker dashboard with profile management, job search, and applications',
    features: ['Profile Management', 'Job Search & Filters', 'Apply to Jobs', 'Saved Jobs', 'Application Tracking'],
    badgeColor: 'bg-green-100 text-green-800',
    buttonColor: 'border-green-200 hover:bg-green-50'
  },
  {
    id: 'employer',
    name: 'Employer Demo',
    email: 'employer.demo@megajobnepal.com',
    password: 'employer123',
    userType: 'employer',
    icon: Building2,
    description: 'Access employer dashboard with job posting, candidate management, and company profile',
    features: ['Post Jobs', 'Candidate Database', 'Company Profile', 'Application Management', 'Subscription Plans'],
    badgeColor: 'bg-blue-100 text-blue-800',
    buttonColor: 'border-blue-200 hover:bg-blue-50'
  },
  {
    id: 'admin',
    name: 'Admin Demo',
    email: 'admin.demo@megajobnepal.com',
    password: 'admin123',
    userType: 'admin',
    icon: Shield,
    description: 'Access comprehensive admin panel with full system management capabilities',
    features: ['User Management', 'Job Management', 'Company Oversight', 'Reports & Analytics', 'System Settings'],
    badgeColor: 'bg-purple-100 text-purple-800',
    buttonColor: 'border-purple-200 hover:bg-purple-50'
  }
];

export function DemoCredentials({ 
  onUseCredentials, 
  showTitle = true, 
  compact = false 
}: DemoCredentialsProps) {
  // Demo credentials are no longer displayed in the interface
  // but are still available for development testing via Guidelines.md
  return null;

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <TestTube2 className="h-4 w-4 text-orange-600" />
          <span className="text-sm font-medium text-orange-600">Demo Accounts</span>
        </div>
        
        {demoAccounts.map((account) => {
          const IconComponent = account.icon;
          return (
            <Button
              key={account.id}
              type="button"
              variant="outline"
              className={`w-full justify-start gap-3 h-auto py-3 ${account.buttonColor}`}
              onClick={() => handleUseAccount(account)}
            >
              <IconComponent className="h-4 w-4" />
              <div className="flex-1 text-left">
                <div className="font-medium">{account.name}</div>
                <div className="text-xs text-gray-500">{account.email}</div>
              </div>
              <ChevronRight className="h-4 w-4" />
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <Card className="w-full">
      {showTitle && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube2 className="h-5 w-5 text-orange-600" />
            Demo Account Access
          </CardTitle>
        </CardHeader>
      )}
      
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Demo Mode:</strong> Choose an account type below to test different user interfaces. 
            No real registration required!
          </AlertDescription>
        </Alert>

        <div className="grid gap-4">
          {demoAccounts.map((account) => {
            const IconComponent = account.icon;
            return (
              <Card key={account.id} className="border-2 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gray-100">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{account.name}</h3>
                        <Badge className={account.badgeColor} variant="secondary">
                          {account.userType.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleUseAccount(account)}
                      size="sm"
                      className="shrink-0"
                    >
                      Use Account
                    </Button>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{account.description}</p>
                  
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500">
                      <div><strong>Email:</strong> {account.email}</div>
                      <div><strong>Password:</strong> {account.password}</div>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Available Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {account.features.map((feature) => (
                          <Badge 
                            key={feature} 
                            variant="outline" 
                            className="text-xs"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Alert className="bg-orange-50 border-orange-200">
          <TestTube2 className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Testing Tip:</strong> After logging in with a demo account, explore the dashboard to see all the features available for that user type. You can log out and try a different account type anytime.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}