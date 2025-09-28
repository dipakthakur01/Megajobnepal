'use client';

import { JobSeekerDashboard } from '@/components/JobSeekerDashboard';
import { useApp } from '@/app/providers/AppProvider';
import { useRouter } from 'next/navigation';

export default function JobSeekerDashboardPage() {
  const { 
    jobs, 
    applications, 
    savedJobs, 
    currentUser 
  } = useApp();
  const router = useRouter();

  const userSavedJobs = jobs.filter(j => savedJobs.includes(j.id));
  const userApplications = applications.filter(app => app.userId === currentUser?.id);

  const handleViewJob = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  return (
    <JobSeekerDashboard 
      savedJobs={userSavedJobs}
      applications={userApplications}
      jobs={jobs}
      currentUser={currentUser}
      onViewJob={handleViewJob}
    />
  );
}