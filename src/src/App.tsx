import React, { useState, useEffect } from "react";
import { AppProvider } from "./components/AppProvider";
import { AuthProvider } from "./components/auth/AuthContext";
import { MainLayout } from "./components/MainLayout";
import { AdminLayout } from "./components/AdminLayout";
import { JobSeekerLayout } from "./components/JobSeekerLayout";
import { EmployerLayout } from "./components/EmployerLayout";
import { AuthTestPage } from "./components/auth/AuthTestPage";
import { DatabaseSetup } from "./components/DatabaseSetup";
// MongoDB integration - no external database client needed
// Using a data URL for the logo since we can't use figma assets in a real React project
const companyLogo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='40' viewBox='0 0 120 40'%3E%3Crect width='120' height='40' fill='%23030213'/%3E%3Ctext x='60' y='25' font-family='Arial, sans-serif' font-size='14' font-weight='bold' text-anchor='middle' fill='white'%3EMegaJob%3C/text%3E%3C/svg%3E";
import "./styles/globals.css";

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isJobSeekerRoute, setIsJobSeekerRoute] = useState(false);
  const [isEmployerRoute, setIsEmployerRoute] = useState(false);
  const [isAuthTestRoute, setIsAuthTestRoute] = useState(false);
  const [dbSetupNeeded, setDbSetupNeeded] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if current route is admin, job seeker, employer, or auth test
  useEffect(() => {
    const path = window.location.pathname;
    setIsAdminRoute(path.startsWith("/admin"));
    setIsJobSeekerRoute(path.startsWith("/jobseeker-dashboard"));
    setIsEmployerRoute(path.startsWith("/employer-dashboard"));
    setIsAuthTestRoute(path.startsWith("/auth-test"));
  }, []);

  // Check if database setup is needed
  useEffect(() => {
    checkDatabaseSetup();
  }, []);

  const checkDatabaseSetup = async () => {
    try {
      // Check if Supabase is properly configured
      const supabaseUrl =
        import.meta.env?.VITE_SUPABASE_URL ||
        "https://your-project.supabase.co";
      if (supabaseUrl === "https://your-project.supabase.co") {
        // Supabase not configured, skip database check
        setDbSetupNeeded(false);
        setLoading(false);
        return;
      }

      // Check if basic tables have data
      const { data: categories } = await supabase
        .from("job_categories")
        .select("id")
        .limit(1);

      // If no categories exist, setup is needed
      if (!categories || categories.length === 0) {
        setDbSetupNeeded(true);
      }
    } catch (error) {
      console.log(
        "Database check failed, continuing without database:",
        error,
      );
      // Don't require setup if Supabase is not configured
      setDbSetupNeeded(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <img 
            src={companyLogo} 
            alt="MegaJob" 
            className="h-16 w-auto object-contain mx-auto mb-4 opacity-90"
          />
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Loading MegaJobNepal...
          </p>
        </div>
      </div>
    );
  }

  // Show auth test page if on auth test route
  if (isAuthTestRoute) {
    return (
      <AuthProvider>
        <AppProvider>
          <div className="min-h-screen bg-background">
            <div className="container mx-auto py-8">
              <AuthTestPage />
            </div>
          </div>
        </AppProvider>
      </AuthProvider>
    );
  }

  // Show database setup if needed and not on admin, job seeker, or employer routes
  if (dbSetupNeeded && !isAdminRoute && !isJobSeekerRoute && !isEmployerRoute) {
    return (
      <AuthProvider>
        <AppProvider>
          <div className="min-h-screen bg-background">
            <DatabaseSetup />
          </div>
        </AppProvider>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <AppProvider>
        <div className="min-h-screen bg-background">
          {isAdminRoute ? (
            <AdminLayout />
          ) : isJobSeekerRoute ? (
            <JobSeekerLayout />
          ) : isEmployerRoute ? (
            <EmployerLayout />
          ) : (
            <MainLayout />
          )}
        </div>
      </AppProvider>
    </AuthProvider>
  );
}