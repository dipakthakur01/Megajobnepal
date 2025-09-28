import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { dbService } from '../lib/mongodb-fixed';

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full Time' | 'Part Time' | 'Contract' | 'Remote';
  category: string;
  salary: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
  logo: string;
  featured: boolean;
  tier: 'megajob' | 'premium' | 'prime';
  source: 'online' | 'newspaper';
  publishedDate: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  type: 'jobseeker' | 'employer' | 'admin';
  profile?: {
    resume?: string;
    skills?: string[];
    experience?: string;
  };
  company?: string;
};

export type Application = {
  id: string;
  jobId: string;
  userId: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  appliedDate: string;
};

type AppContextType = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
  applications: Application[];
  setApplications: (applications: Application[]) => void;
  savedJobs: string[];
  setSavedJobs: (savedJobs: string[]) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  companies: any[];
  setCompanies: (companies: any[]) => void;
  filters: {
    location: string;
    type: string;
    category: string;
    salary: string;
    experience: string;
  };
  setFilters: (filters: any) => void;
  handleApplyJob: (jobId: string) => void;
  handleSaveJob: (jobId: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export function AppProvider({ children }: { children: ReactNode }) {
  // Fallback mock data
  const mockJobs: Job[] = [
    {
      id: '1',
      title: 'Senior Banking Officer',
      company: 'Himalayan Bank Ltd',
      location: 'Kathmandu',
      type: 'Full Time',
      category: 'Banking/Finance',
      salary: 'Rs. 65,000 - 85,000',
      experience: 'Senior Level',
      description: 'We are seeking an experienced Senior Banking Officer to manage client relationships and oversee banking operations.',
      requirements: ['Bachelor in Banking/Finance', '5+ years banking experience', 'Strong analytical skills', 'Customer relationship management'],
      benefits: ['Health insurance', 'Retirement plans', 'Professional development', 'Performance bonuses'],
      postedDate: '2 days left',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
      featured: true,
      tier: 'megajob',
      source: 'online',
      publishedDate: '2024-12-15'
    },
    {
      id: '2',
      title: 'React Developer',
      company: 'TechVision Nepal',
      location: 'Kathmandu',
      type: 'Full Time',
      category: 'Technology',
      salary: 'Rs. 60,000 - 90,000',
      experience: 'Mid Level',
      description: 'Join our team to build amazing web applications using modern frontend technologies.',
      requirements: ['React/Vue.js experience', 'JavaScript proficiency', 'CSS/HTML skills', 'Git knowledge'],
      benefits: ['Flexible hours', 'Learning opportunities', 'Modern office', 'Team events'],
      postedDate: 'Just posted',
      logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&h=100&fit=crop',
      featured: false,
      tier: 'premium',
      source: 'online',
      publishedDate: '2024-12-17'
    },
    {
      id: '3',
      title: 'Network Engineer',
      company: 'Nepal Telecommunications Authority',
      location: 'Lalitpur',
      type: 'Full Time',
      category: 'Engineering',
      salary: 'Rs. 70,000 - 90,000',
      experience: 'Senior Level',
      description: 'Design and optimize our 4G/5G network infrastructure across Nepal.',
      requirements: ['Telecom Engineering degree', 'Network optimization experience', '5G knowledge', 'RF planning skills'],
      benefits: ['Cutting-edge technology', 'International exposure', 'Medical coverage', 'Career growth'],
      postedDate: '3 days left',
      logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
      featured: true,
      tier: 'megajob',
      source: 'online',
      publishedDate: '2024-12-13'
    }
  ];

  // Mock companies data as fallback
  const mockCompanies = [
    {
      name: 'TechVision Nepal',
      industry: 'Information Technology',
      location: 'Kathmandu, Nepal',
      size: '50-100 employees',
      description: 'Leading software development company in Nepal specializing in web and mobile applications.',
      website: 'https://www.techvision.com.np',
      email: 'info@techvision.com.np',
      phone: '+977-1-4444444',
      founded: '2018',
      benefits: ['Competitive salary', 'Flexible working hours', 'Learning opportunities', 'Modern office'],
      specialties: ['Web Development', 'Mobile Apps', 'Cloud Solutions', 'UI/UX Design'],
      logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&h=100&fit=crop',
      verified: true
    },
    {
      name: 'Himalayan Bank Ltd',
      industry: 'Banking & Finance',
      location: 'Kathmandu, Nepal',
      size: '500+ employees',
      description: 'One of Nepal\'s premier commercial banks offering comprehensive financial services.',
      website: 'https://www.himalayanbank.com',
      email: 'info@himalayanbank.com',
      phone: '+977-1-4221800',
      founded: '1993',
      benefits: ['Health insurance', 'Retirement plans', 'Professional development', 'Performance bonuses'],
      specialties: ['Commercial Banking', 'Corporate Banking', 'Digital Banking', 'International Banking'],
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
      verified: true
    },
    {
      name: 'Nepal Telecommunications Authority',
      industry: 'Telecommunications',
      location: 'Kathmandu, Nepal',
      size: '100-200 employees',
      description: 'Government regulatory body for telecommunications in Nepal.',
      website: 'https://www.nta.gov.np',
      email: 'info@nta.gov.np',
      phone: '+977-1-5555555',
      founded: '1998',
      benefits: ['Government benefits', 'Job security', 'Medical coverage', 'Training opportunities'],
      specialties: ['Telecommunications Regulation', 'Policy Development', 'Spectrum Management', 'Consumer Protection'],
      logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
      verified: true
    }
  ];

  // State declarations
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    category: '',
    salary: '',
    experience: ''
  });
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@megajobnepal.com',
      type: 'admin'
    },
    {
      id: '2', 
      name: 'John Doe',
      email: 'john@example.com',
      type: 'jobseeker',
      profile: {
        skills: ['JavaScript', 'React', 'Node.js'],
        experience: '3 years in web development',
        resume: 'https://example.com/resume.pdf'
      }
    },
    {
      id: '3',
      name: 'Jane Smith', 
      email: 'jane@himalayanbank.com',
      type: 'employer',
      company: 'Himalayan Bank Ltd'
    },
    {
      id: '4',
      name: 'HR Manager',
      email: 'hr@megajobnepal.com',
      type: 'admin'
    }
  ]);
  const [companies, setCompanies] = useState<any[]>([]);

  // Fast, non-blocking data loading
  useEffect(() => {
    let isMounted = true;
    
    // Load data in background without blocking app startup
    const loadDataInBackground = () => {
      // Start with mock data immediately
      setJobs(mockJobs);
      setCompanies(mockCompanies);
      
      // Then try to load real data in background
      setTimeout(async () => {
        if (!isMounted) return;
        
        try {
          // Quick parallel loading with short timeout
          const [jobsResult, companiesResult] = await Promise.allSettled([
            Promise.race([
              loadJobsFromDatabase(),
              new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1000))
            ]),
            Promise.race([
              loadCompaniesFromDatabase(), 
              new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1000))
            ])
          ]);

          // Only update if we got better data
          if (jobsResult.status === 'fulfilled' && isMounted) {
            console.log('📝 Jobs loaded from database');
          }
          if (companiesResult.status === 'fulfilled' && isMounted) {
            console.log('🏢 Companies loaded from database');
          }
        } catch (error) {
          // Silent fail - already have mock data
          console.log('📋 Using mock data (database unavailable)');
        }
      }, 100); // Start loading after 100ms to not block startup
    };

    loadDataInBackground();

    return () => {
      isMounted = false;
    };
  }, []);

  const loadJobsFromDatabase = async () => {
    try {
      // Quick database load with shorter timeout
      const dbJobs = await Promise.race([
        dbService.getJobs(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 800))
      ]);

      // Only proceed if we have valid data
      if (!Array.isArray(dbJobs)) {
        throw new Error('Invalid jobs data received');
      }

      // Simple job transformation without external dependencies
      const transformedJobs: Job[] = dbJobs.map(job => ({
        id: job.id || job._id || `job-${Date.now()}-${Math.random()}`,
        title: job.title || 'Job Position',
        company: job.company || 'Company Name',
        location: job.location || 'Remote',
        type: job.type || 'Full Time',
        category: job.category || 'General',
        salary: job.salary || 'Competitive Salary',
        experience: job.experience || 'Entry Level',
        description: job.description || 'Job description not available',
        requirements: Array.isArray(job.requirements) ? job.requirements : ['Requirements not specified'],
        benefits: Array.isArray(job.benefits) ? job.benefits : ['Benefits available'],
        postedDate: job.postedDate || 'Recently',
        logo: job.logo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop',
        featured: job.featured || false,
        tier: job.tier || 'prime',
        source: job.source || 'online',
        publishedDate: job.publishedDate || new Date().toISOString().split('T')[0]
      }));

      setJobs(transformedJobs);
      console.log(`✅ Loaded ${transformedJobs.length} jobs from database`);
    } catch (error) {
      console.log('🔄 Database loading failed, using mock data:', error.message);
      // Don't throw error, just keep existing mock data
    }
  };

  const loadCompaniesFromDatabase = async () => {
    try {
      const dbCompanies = await Promise.race([
        dbService.getCompanies(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 800))
      ]);

      if (Array.isArray(dbCompanies) && dbCompanies.length > 0) {
        setCompanies(dbCompanies);
      }
    } catch (error) {
      // Silent fail - keep mock data
      console.log('Companies loading skipped:', error.message);
    }
  };

  const handleApplyJob = (jobId: string) => {
    if (!currentUser) {
      return;
    }
    
    const newApplication: Application = {
      id: Date.now().toString(),
      jobId,
      userId: currentUser.id,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };
    
    setApplications([...applications, newApplication]);
  };

  const handleSaveJob = (jobId: string) => {
    if (!currentUser) {
      // This will be handled in the JobCard component now
      return { requiresLogin: true };
    }
    
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
      return { removed: true };
    } else {
      setSavedJobs([...savedJobs, jobId]);
      return { added: true };
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        jobs,
        setJobs,
        applications,
        setApplications,
        savedJobs,
        setSavedJobs,
        users,
        setUsers,
        companies,
        setCompanies,
        filters,
        setFilters,
        handleApplyJob,
        handleSaveJob,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}