'use client';

import { EmployerDashboard } from '@/components/EmployerDashboard';
import { useApp } from '@/app/providers/AppProvider';

export default function EmployerDashboardPage() {
  const { jobs, applications, currentUser } = useApp();

  const employerJobs = jobs.filter(j => currentUser?.type === 'employer');

  return (
    <EmployerDashboard 
      jobs={employerJobs}
      applications={applications}
      currentUser={currentUser}
    />
  );
}