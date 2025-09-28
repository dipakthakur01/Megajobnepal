'use client';

import { JobDetail } from '@/components/JobDetail';
import { useApp } from '@/app/providers/AppProvider';
import { useRouter } from 'next/navigation';
import { use } from 'react';

export default function JobDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params);
  const { 
    jobs, 
    applications, 
    savedJobs, 
    currentUser, 
    handleApplyJob, 
    handleSaveJob 
  } = useApp();
  const router = useRouter();

  const job = jobs.find(j => j.id === id);
  const relatedJobs = jobs.filter(j => j.id !== id).slice(0, 3);
  const isSaved = savedJobs.includes(id);
  const hasApplied = applications.some(app => 
    app.jobId === id && app.userId === currentUser?.id
  );

  const handleViewJob = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
          <p className="text-gray-600 mb-4">The job you're looking for doesn't exist.</p>
          <button 
            onClick={() => router.push('/jobs')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Browse Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <JobDetail 
      job={job}
      relatedJobs={relatedJobs}
      onApply={handleApplyJob}
      onSave={handleSaveJob}
      isSaved={isSaved}
      hasApplied={hasApplied}
      onViewJob={handleViewJob}
    />
  );
}