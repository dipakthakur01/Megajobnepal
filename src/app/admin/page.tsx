'use client';

import { NewAdminPanel } from '@/components/NewAdminPanel';
import { useApp } from '@/app/providers/AppProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const { 
    jobs, 
    users, 
    applications, 
    companies, 
    currentUser,
    setJobs,
    setUsers,
    setCompanies
  } = useApp();
  const router = useRouter();

  // Check if user is authenticated and is admin
  useEffect(() => {
    if (!currentUser || currentUser.type !== 'admin') {
      router.push('/admin/login');
    }
  }, [currentUser, router]);

  const handleBackToWebsite = () => {
    router.push('/');
  };

  const handleLogout = () => {
    router.push('/admin/login');
  };

  if (!currentUser || currentUser.type !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">Please login to access the admin panel.</p>
          <button 
            onClick={() => router.push('/admin/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <NewAdminPanel
      jobs={jobs}
      users={users}
      applications={applications}
      companies={companies}
      onJobUpdate={setJobs}
      onUserUpdate={setUsers}
      onCompanyUpdate={setCompanies}
      currentUser={currentUser}
      onBackToWebsite={handleBackToWebsite}
      onLogout={handleLogout}
    />
  );
}