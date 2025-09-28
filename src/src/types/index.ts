// Global type definitions for the application

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  postedDate: string;
  deadline: string;
  salary: string;
  type: 'mega_job' | 'premium_job' | 'prime_job' | 'latest_job' | 'newspaper_job';
  category: string;
  experience: string;
  tags: string[];
  featured?: boolean;
  urgent?: boolean;
  companyLogo?: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  website: string;
  description: string;
  employees: string;
  founded: string;
  jobCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  type: 'jobseeker' | 'employer' | 'admin';
  role?: 'admin' | 'hr' | 'job_seeker' | 'employer';
  avatar?: string;
  company?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  appliedDate: string;
  coverLetter?: string;
}

export interface JobFilters {
  search: string;
  location: string;
  category: string;
  type: string;
  experience: string;
  salary: string;
}