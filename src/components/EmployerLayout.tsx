import React, { useState, useEffect } from 'react';
import { LoginModal } from './LoginModal';
import { useApp } from './AppProvider';
import { useAuth } from './auth/AuthContext';
import { Button } from './ui/button';
import { Globe, Briefcase } from 'lucide-react';
import { EmployerJobSeekerDashboard } from './EmployerJobSeekerDashboard';

export function EmployerLayout() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const { 
    currentUser, 
    setCurrentUser,
    jobs = [],
    applications = [],
    setApplications
  } = useApp();

  const { user: authUser, isAuthenticated, logout: authLogout, loading } = useAuth();

  // Check authentication status and sync with app provider
  useEffect(() => {
    if (isAuthenticated && authUser) {
      // For employer dashboard, accept only employer role
      if (authUser.role === 'employer') {
        // Sync AuthContext user with AppProvider format
        if (!currentUser || currentUser.id !== authUser.id) {
          setCurrentUser({
            id: authUser.id,
            name: authUser.first_name && authUser.last_name 
              ? `${authUser.first_name} ${authUser.last_name}`
              : authUser.email,
            email: authUser.email,
            type: 'employer',
            profile: {
              skills: [],
              experience: '',
              resume: ''
            }
          });
        }
        setShowLoginModal(false);
      } else if (authUser.role === 'admin') {
        // Admins should be redirected to admin dashboard
        window.location.href = '/admin';
        return;
      } else if (authUser.role === 'job_seeker') {
        // Job seekers should be redirected to job seeker dashboard
        window.location.href = '/jobseeker-dashboard';
        return;
      }
    } else if (!isAuthenticated) {
      setCurrentUser(null);
      setShowLoginModal(true);
    }
  }, [isAuthenticated, authUser, currentUser, setCurrentUser]);

  const handleLoginSuccess = (user: any) => {
    if (user && user.type === 'employer') {
      setCurrentUser(user);
      setShowLoginModal(false);
    }
  };

  const handleBackToWebsite = () => {
    window.location.href = '/';
  };

  const handleLogout = async () => {
    try {
      await authLogout();
      setCurrentUser(null);
      // Redirect to home page after logout
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if there's an error
      setCurrentUser(null);
      window.location.href = '/';
    }
  };

  // Show loading screen while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated or not an employer
  if (!isAuthenticated || !authUser || authUser.role !== 'employer') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Employer Dashboard</h1>
            <p className="text-muted-foreground">Sign in as an employer to access your dashboard</p>
          </div>

          <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
            <div className="text-center mb-6">
              <Button
                variant="outline"
                onClick={handleBackToWebsite}
                className="flex items-center gap-2 mx-auto"
              >
                <Globe className="h-4 w-4" />
                Back to Website
              </Button>
            </div>

            {showLoginModal && (
              <div className="relative">
                <LoginModal
                  isOpen={showLoginModal}
                  onClose={() => setShowLoginModal(false)}
                  onLoginSuccess={handleLoginSuccess}
                  targetUserType="employer"
                />
              </div>
            )}

            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">Demo Employer Credentials:</p>
              <div className="bg-accent/50 rounded-md p-3 text-sm">
                <p><strong>Employer:</strong> employer.demo@megajobnepal.com / employer123</p>
                <p><strong>Company:</strong> TechCorp Solutions</p>
                <p><strong>ID:</strong> EMP001</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show employer dashboard
  return (
    <div className="min-h-screen bg-background">
      {/* Header with back to website button */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-primary">Employer Dashboard</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>Company Management & Recruitment</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToWebsite}
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              Back to Website
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <EmployerJobSeekerDashboard
        user={currentUser}
        jobs={jobs}
        applications={applications}
        onApplicationUpdate={setApplications}
        onLogout={handleLogout}
      />
    </div>
  );
}