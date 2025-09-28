import React, { useState, useEffect, Suspense, lazy, startTransition } from "react";
import { AppProvider } from "./components/AppProvider";
import { AuthProvider } from "./components/auth/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LoadingFallback } from "./components/LoadingFallback";
import { EmergencyApp } from "./components/EmergencyApp";

import "/styles/globals.css";

// Simple lazy loading without complex timeouts
const MainLayout = lazy(() => import("./components/MainLayout").then(m => ({ default: m.MainLayout })));
const AdminLayout = lazy(() => import("./components/AdminLayout").then(m => ({ default: m.AdminLayout })));
const JobSeekerLayout = lazy(() => import("./components/JobSeekerLayout").then(m => ({ default: m.JobSeekerLayout })));
const EmployerLayout = lazy(() => import("./components/EmployerLayout").then(m => ({ default: m.EmployerLayout })));
const DatabaseSetup = lazy(() => import("./components/DatabaseSetup").then(m => ({ default: m.DatabaseSetup })));

export default function App() {
  const [appState, setAppState] = useState({
    loading: true,
    dbSetupNeeded: false,
    currentRoute: 'main' as 'main' | 'admin' | 'jobseeker' | 'employer',
    useEmergencyMode: false
  });

  // Simplified initialization
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("🚀 Starting MegaJobNepal...");
        
        // Determine current route
        const path = window?.location?.pathname || '/';
        const currentRoute = path.includes("/admin") ? 'admin' :
                            path.includes("/jobseeker") ? 'jobseeker' :
                            path.includes("/employer") ? 'employer' : 'main';

        // Check if database setup is needed
        let hasValidData = false;
        try {
          const users = localStorage.getItem('mongodb_megajobnepal_users');
          const jobs = localStorage.getItem('mongodb_megajobnepal_jobs');
          hasValidData = !!(users && jobs && users !== '[]' && jobs !== '[]');
        } catch {
          hasValidData = false;
        }

        // Update state with startTransition for better performance
        startTransition(() => {
          setAppState({
            loading: false,
            dbSetupNeeded: !hasValidData,
            currentRoute,
            useEmergencyMode: false
          });
        });

        console.log(`✅ App ready: ${currentRoute}, DB setup needed: ${!hasValidData}`);
        console.log(`📊 Performance: Initialization took ${Date.now() - performance.now()}ms`);
        
      } catch (error) {
        console.error("Initialization error:", error);
        setAppState({
          loading: false,
          dbSetupNeeded: false,
          currentRoute: 'main',
          useEmergencyMode: true
        });
      }
    };

    initializeApp();
  }, []);

  const { loading, dbSetupNeeded, currentRoute, useEmergencyMode } = appState;

  // Show loading screen
  if (loading) {
    return <LoadingFallback />;
  }

  // Emergency mode fallback
  if (useEmergencyMode) {
    return <EmergencyApp />;
  }

  // Database setup needed
  if (dbSetupNeeded && currentRoute === 'main') {
    return (
      <ErrorBoundary fallback={EmergencyApp}>
        <AuthProvider>
          <AppProvider>
            <Suspense fallback={<LoadingFallback />}>
              <DatabaseSetup />
            </Suspense>
          </AppProvider>
        </AuthProvider>
      </ErrorBoundary>
    );
  }

  // Main app layout
  const LayoutComponent = currentRoute === 'admin' ? AdminLayout :
                         currentRoute === 'jobseeker' ? JobSeekerLayout :
                         currentRoute === 'employer' ? EmployerLayout : MainLayout;

  return (
    <ErrorBoundary fallback={EmergencyApp}>
      <div className="min-h-screen bg-background">
        <AuthProvider>
          <AppProvider>
            <Suspense fallback={<LoadingFallback />}>
              <LayoutComponent />
            </Suspense>
          </AppProvider>
        </AuthProvider>
      </div>
    </ErrorBoundary>
  );
}