import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DemoCredentials } from './auth/DemoCredentials';
import { DemoAccountVerifier } from './auth/DemoAccountVerifier';
import { 
  TestTube2, 
  Users, 
  Building2, 
  Shield, 
  ExternalLink,
  ArrowRight,
  Globe
} from 'lucide-react';

const demoPages = [
  {
    title: 'Job Seeker Dashboard',
    path: '/jobseeker-dashboard',
    description: 'Explore job search, profile management, and application tracking features',
    requiredAccount: 'Job Seeker Demo',
    icon: Users,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    title: 'Employer Dashboard', 
    path: '/employer-dashboard',
    description: 'Test job posting, candidate management, and company profile features',
    requiredAccount: 'Employer Demo',
    icon: Building2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'Admin Panel',
    path: '/admin',
    description: 'Access comprehensive admin controls and system management',
    requiredAccount: 'Admin Demo',
    icon: Shield,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    title: 'Main Website',
    path: '/',
    description: 'Browse the public website with job listings and company pages',
    requiredAccount: 'No login required',
    icon: Globe,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  }
];

export function DemoPage() {
  const handleNavigate = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <TestTube2 className="h-8 w-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-900">MegaJobNepal Demo</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test all features of MegaJobNepal with pre-configured demo accounts. 
            No registration required - just pick an account and start exploring!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Demo Credentials Section */}
          <div className="space-y-6">
            <DemoAccountVerifier />
            <DemoCredentials showTitle={true} />
          </div>

          {/* Quick Access Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-orange-600" />
                  Quick Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {demoPages.map((page) => {
                  const IconComponent = page.icon;
                  return (
                    <Card key={page.path} className="border-2 hover:shadow-md transition-all cursor-pointer group">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`p-2 rounded-lg ${page.bgColor}`}>
                              <IconComponent className={`h-5 w-5 ${page.color}`} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                                {page.title}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">{page.description}</p>
                              <Badge variant="outline" className="mt-2 text-xs">
                                {page.requiredAccount}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleNavigate(page.path)}
                            size="sm"
                            variant="outline"
                            className="shrink-0 group-hover:bg-orange-50 group-hover:border-orange-200"
                          >
                            Visit
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">How to Test</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-700 space-y-2">
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Choose a demo account from the left panel</li>
                  <li>Click "Use Account" to auto-fill login credentials</li>
                  <li>Navigate to the corresponding dashboard or use Quick Access</li>
                  <li>Explore all the features available for that user type</li>
                  <li>Log out and try a different account type to compare</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Overview */}
        <Card>
          <CardHeader>
            <CardTitle>What You Can Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-green-800">Job Seeker Features</h3>
                </div>
                <ul className="text-sm text-gray-600 space-y-1 ml-7">
                  <li>• Profile management & resume upload</li>
                  <li>• Advanced job search with filters</li>
                  <li>• Job applications & tracking</li>
                  <li>• Saved jobs & bookmarks</li>
                  <li>• Job alerts & recommendations</li>
                </ul>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-800">Employer Features</h3>
                </div>
                <ul className="text-sm text-gray-600 space-y-1 ml-7">
                  <li>• Company profile & branding</li>
                  <li>• Job posting & management</li>
                  <li>• Candidate database search</li>
                  <li>• Application management</li>
                  <li>• Subscription packages</li>
                </ul>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-purple-800">Admin Features</h3>
                </div>
                <ul className="text-sm text-gray-600 space-y-1 ml-7">
                  <li>• User & role management</li>
                  <li>• Job & company oversight</li>
                  <li>• Reports & analytics</li>
                  <li>• System configuration</li>
                  <li>• Content management</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>© 2024 MegaJobNepal. All rights reserved. | Demo Environment</p>
        </div>
      </div>
    </div>
  );
}