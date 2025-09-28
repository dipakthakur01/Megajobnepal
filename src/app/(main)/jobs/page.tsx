'use client';

import { JobListings } from '@/components/JobListings';
import { useApp } from '@/app/providers/AppProvider';
import { useRouter } from 'next/navigation';

export default function JobsPage() {
  const { jobs, filters, setFilters, savedJobs, handleSaveJob } = useApp();
  const router = useRouter();

  const handleViewJob = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  return (
    <JobListings 
      jobs={jobs}
      onViewJob={handleViewJob}
      filters={filters}
      onFilterChange={setFilters}
      onSaveJob={handleSaveJob}
      savedJobs={savedJobs}
    />
  );
}