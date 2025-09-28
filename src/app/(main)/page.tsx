'use client';

import { HomePage } from '@/components/HomePage';
import { useApp } from '@/app/providers/AppProvider';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { jobs, filters, setFilters } = useApp();
  const router = useRouter();

  const handleNavigation = (page: string, param?: string) => {
    switch (page) {
      case 'job-detail':
        router.push(`/jobs/${param}`);
        break;
      case 'company-detail':
        router.push(`/companies/${param}`);
        break;
      default:
        router.push(`/${page}`);
        break;
    }
  };

  const handleViewJob = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  return (
    <HomePage 
      jobs={jobs}
      onNavigate={handleNavigation}
      onViewJob={handleViewJob}
      filters={filters}
      onFilterChange={setFilters}
    />
  );
}