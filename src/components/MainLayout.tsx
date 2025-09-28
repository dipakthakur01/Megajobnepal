import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { Header } from './Header';
import { FooterEnhanced } from './FooterEnhanced';
import { LoginModal } from './LoginModal';
import { ScrollToTop } from './ScrollToTop';
import { RecruitmentPopup } from './RecruitmentPopup';
import { LoadingFallback } from './LoadingFallback';
import { useApp } from './AppProvider';
import { useAuth } from './auth/AuthContext';

// Lazy load page components to prevent timeout
const HomePage = lazy(() => import('./HomePage').then(m => ({ default: m.HomePage })));
const JobListings = lazy(() => import('./JobListings').then(m => ({ default: m.JobListings })));
const JobDetail = lazy(() => import('./JobDetail').then(m => ({ default: m.JobDetail })));
const AboutPage = lazy(() => import('./AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./ContactPage').then(m => ({ default: m.ContactPage })));
const BlogsPage = lazy(() => import('./BlogsPage').then(m => ({ default: m.BlogsPage })));
const EmployersPage = lazy(() => import('./EmployersPage').then(m => ({ default: m.EmployersPage })));
const CompanyDetailPage = lazy(() => import('./CompanyDetailPage').then(m => ({ default: m.CompanyDetailPage })));
const EmployerDashboard = lazy(() => import('./EmployerDashboard').then(m => ({ default: m.EmployerDashboard })));

export function MainLayout() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedCompanyName, setSelectedCompanyName] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pageFilter, setPageFilter] = useState<{ type: string; value: string } | undefined>();
  const [showRecruitmentPopup, setShowRecruitmentPopup] = useState(false);
  
  const { 
    currentUser, 
    setCurrentUser,
    jobs,
    applications,
    savedJobs,
    filters,
    setFilters,
    handleApplyJob,
    handleSaveJob
  } = useApp();

  const { user: authUser, isAuthenticated, logout: authLogout } = useAuth();

  // Sync authentication state and handle auto-redirect
  useEffect(() => {
    if (isAuthenticated && authUser) {
      // Convert AuthContext user to AppProvider format
      const newUser = {
        id: authUser.id,
        name: authUser.full_name || 
          (authUser.first_name && authUser.last_name 
            ? `${authUser.first_name} ${authUser.last_name}`
            : authUser.email),
        email: authUser.email,
        type: (authUser.role === 'job_seeker' || authUser.user_type === 'job_seeker') ? 'jobseeker' : 
              (authUser.role === 'admin' || authUser.user_type === 'admin') ? 'admin' : 'employer',
        profile: {
          skills: [],
          experience: '',
          resume: ''
        },
        company: ((authUser.role === 'employer' || authUser.user_type === 'employer')) ? 'Sample Company' : undefined
      };

      if (!currentUser || currentUser.id !== authUser.id) {
        setCurrentUser(newUser);
        
        // Auto-redirect to dashboard after successful authentication
        // Only redirect if we're on the main layout (not already on a dashboard)
        const currentPath = window.location.pathname;
        if (currentPath === '/' || currentPath === '/home') {
          setTimeout(() => {
            if (newUser.type === 'admin') {
              window.open('/admin', '_blank');
            } else if (newUser.type === 'jobseeker') {
              window.open('/jobseeker-dashboard', '_blank');
            } else if (newUser.type === 'employer') {
              window.open('/employer-dashboard', '_blank');
            }
          }, 1000);
        }
      }
    } else if (!isAuthenticated) {
      setCurrentUser(null);
    }
  }, [isAuthenticated, authUser, currentUser, setCurrentUser]);

  // Show recruitment popup logic - only for non-employers after some time
  useEffect(() => {
    // Don't show if user is already an employer or admin
    if (currentUser && (currentUser.type === 'employer' || currentUser.type === 'admin')) {
      return;
    }

    // Check if user has dismissed the popup before (localStorage)
    const dismissedRecently = localStorage.getItem('megajob-recruitment-popup-dismissed');
    if (dismissedRecently) {
      const dismissedTime = parseInt(dismissedRecently);
      const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000); // 1 week
      if (dismissedTime > oneWeekAgo) {
        return; // Don't show again for a week
      }
    }

    // Show popup after 10 seconds of browsing (for both visitors and job seekers)
    const timer = setTimeout(() => {
      setShowRecruitmentPopup(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, [currentUser]);

  // Enhanced smooth scroll to top function with visual content movement
  const smoothScrollToTop = useCallback(() => {
    // Use simpler, more reliable scroll method
    try {
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    } catch (error) {
      // Fallback for older browsers
      window.scrollTo(0, 0);
    }
  }, []);

  const handleNavigation = (page: string, filterOrParam?: { type: string; value: string } | string) => {
    // Always auto scroll to top when navigating, even if staying on same page
    try {
      smoothScrollToTop();
    } catch (error) {
      console.error('Scroll error:', error);
      // Fallback to simple scroll
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Handle auth page navigation by showing login modal
    if (page === 'auth') {
      setShowLoginModal(true);
      return;
    }
    
    setCurrentPage(page);
    
    // Handle different parameter types
    if (typeof filterOrParam === 'string') {
      // Legacy string parameter handling
      if (page === 'job-detail') {
        setSelectedJobId(filterOrParam);
      } else if (page === 'company-detail') {
        setSelectedCompanyName(filterOrParam);
      }
    } else if (filterOrParam && typeof filterOrParam === 'object') {
      // New filter parameter handling
      setPageFilter(filterOrParam);
    } else {
      // Clear filter when no parameter provided
      setPageFilter(undefined);
    }
  };

  // Enhanced navigation that always scrolls to top
  const handleNavigationWithScroll = (page: string, filterOrParam?: { type: string; value: string } | string) => {
    // Always scroll to top regardless of current page
    smoothScrollToTop();
    
    // Update page state even if it's the same page to ensure consistency
    setCurrentPage(page);
    
    if (typeof filterOrParam === 'string') {
      if (page === 'job-detail') {
        setSelectedJobId(filterOrParam);
      } else if (page === 'company-detail') {
        setSelectedCompanyName(filterOrParam);
      }
    } else if (filterOrParam && typeof filterOrParam === 'object') {
      setPageFilter(filterOrParam);
    } else {
      setPageFilter(undefined);
    }
  };

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    setShowLoginModal(false);
    
    // Redirect users to their appropriate dashboards
    if (user.type === 'admin') {
      window.location.href = '/admin';
    } else if (user.type === 'jobseeker') {
      window.location.href = '/jobseeker-dashboard';
    } else if (user.type === 'employer') {
      window.location.href = '/employer-dashboard';
    }
  };

  const handleLogout = async () => {
    try {
      await authLogout();
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if there's an error
      setCurrentUser(null);
    }
  };

  const handleViewJob = (jobId: string) => {
    // Visual scroll to top when viewing job details
    smoothScrollToTop();
    
    setSelectedJobId(jobId);
    setCurrentPage('job-detail');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <HomePage 
              jobs={jobs}
              onNavigate={handleNavigation}
              onViewJob={handleViewJob}
              filters={filters}
              onFilterChange={setFilters}
              onSaveJob={handleSaveJob}
              savedJobs={savedJobs}
              isUserLoggedIn={!!currentUser}
              onLoginRequired={() => setShowLoginModal(true)}
            />
          </Suspense>
        );
      case 'jobs':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <JobListings 
              onViewJob={handleViewJob}
              onSaveJob={handleSaveJob}
              savedJobs={savedJobs}
              filter={pageFilter}
              isUserLoggedIn={!!currentUser}
              onLoginRequired={() => setShowLoginModal(true)}
            />
          </Suspense>
        );
      case 'job-detail':
        const job = jobs.find(j => j.id === selectedJobId);
        const relatedJobs = jobs.filter(j => j.id !== selectedJobId).slice(0, 3);
        const isSaved = selectedJobId ? savedJobs.includes(selectedJobId) : false;
        const hasApplied = applications.some(app => 
          app.jobId === selectedJobId && app.userId === currentUser?.id
        );
        
        return (
          <Suspense fallback={<LoadingFallback />}>
            <JobDetail 
              job={job}
              relatedJobs={relatedJobs}
              onApply={handleApplyJob}
              onSave={handleSaveJob}
              isSaved={isSaved}
              hasApplied={hasApplied}
              onViewJob={handleViewJob}
              onViewCompany={(companyName: string) => handleNavigation('company-detail', companyName)}
              currentUser={currentUser}
            />
          </Suspense>
        );
      case 'about':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <AboutPage />
          </Suspense>
        );
      case 'contact':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ContactPage />
          </Suspense>
        );
      case 'blogs':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <BlogsPage />
          </Suspense>
        );
      case 'employers':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <EmployersPage onNavigate={handleNavigation} filter={pageFilter} />
          </Suspense>
        );
      case 'company-detail':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <CompanyDetailPage 
              companyName={selectedCompanyName || ''}
              jobs={jobs}
              onViewJob={handleViewJob}
              onSaveJob={handleSaveJob}
              savedJobs={savedJobs}
              onNavigate={handleNavigation}
            />
          </Suspense>
        );
      case 'employer-dashboard':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <EmployerDashboard 
              jobs={jobs.filter(j => currentUser?.type === 'employer')}
              applications={applications}
              currentUser={currentUser}
            />
          </Suspense>
        );

      default:
        return (
          <Suspense fallback={<LoadingFallback />}>
            <HomePage 
              jobs={jobs}
              onNavigate={handleNavigation}
              onViewJob={handleViewJob}
              filters={filters}
              onFilterChange={setFilters}
            />
          </Suspense>
        );
    }
  };

  // Handle recruitment popup actions
  const handleCloseRecruitmentPopup = () => {
    setShowRecruitmentPopup(false);
    // Store dismissal time in localStorage
    localStorage.setItem('megajob-recruitment-popup-dismissed', Date.now().toString());
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        onNavigate={handleNavigation}
        onLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        currentPage={currentPage}
      />
      
      <main className="flex-1">
        {renderPage()}
      </main>
      
      <FooterEnhanced />
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
      
      {showLoginModal && (
        <LoginModal 
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      )}

      {/* Recruitment Popup */}
      {showRecruitmentPopup && (
        <RecruitmentPopup
          onClose={handleCloseRecruitmentPopup}
        />
      )}
    </div>
  );
}