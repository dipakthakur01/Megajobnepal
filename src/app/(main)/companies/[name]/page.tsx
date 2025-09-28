'use client';

import { CompanyDetailPage } from '@/components/CompanyDetailPage';
import { useApp } from '@/app/providers/AppProvider';
import { useRouter } from 'next/navigation';
import { use } from 'react';

export default function CompanyDetail({ 
  params 
}: { 
  params: Promise<{ name: string }> 
}) {
  const { name } = use(params);
  const { jobs, savedJobs, handleSaveJob } = useApp();
  const router = useRouter();

  const companyName = decodeURIComponent(name);

  const handleViewJob = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  const handleNavigation = (page: string) => {
    switch (page) {
      case 'employers':
        router.push('/employers');
        break;
      default:
        router.push(`/${page}`);
        break;
    }
  };

  return (
    <CompanyDetailPage 
      companyName={companyName}
      jobs={jobs}
      onViewJob={handleViewJob}
      onSaveJob={handleSaveJob}
      savedJobs={savedJobs}
      onNavigate={handleNavigation}
    />
  );
}